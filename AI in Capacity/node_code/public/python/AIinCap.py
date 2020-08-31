# -*- coding: utf-8 -*-
"""
Created on Sun Aug 30 02:54:36 2020

@author: Sravan.Tallozu
"""

# -*- coding: utf-8 -*-
"""
Created on Tue Aug 25 00:17:23 2020

@author: Sravan.Tallozu
"""

# -*- coding: utf-8 -*-
"""
Created on Sat Aug 15 23:52:49 2020

https://hdbscan.readthedocs.io/en/latest/comparing_clustering_algorithms.html

Probability of the matching skills for in technical, functional, process, 1 being more matching in the respective areas
Bench aging No of weeks, make the scale uniform 1 been more bench
If same location 1 else 0.5
Experience, make the scale uniform 1 been more exp
Location, 1 been same location else 0.5
Rank, make the scale uniform 1 been more Rank1, Rank 5 will be the lowest


@author: Sravan.Tallozu
"""


#fp = r"C:\Users\Sravan.Tallozu\Documents\projects\AI in Capability\PS1 - ES Hackathon_SampleData_AI In Capacity Management8421018.xlsx"
#input_df = pd.read_excel(fp,sheet_name='inputs')
#skill_tree_df = pd.read_excel(fp,sheet_name='Skill_Tree')
#emp_eng_df = pd.read_excel(fp,sheet_name='Reviews')

#Id = "5f494c49b731c05b1cf459f6"

print('PYTHON STARTED *****************')



import traceback
import pandas as pd
import re    
from gensim.models import Word2Vec
import numpy as np
import sys
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import json
import sys
import numpy as np
import random
from sklearn.metrics import f1_score
import torch
from transformers import BertTokenizer
from torch.utils.data import TensorDataset
from transformers import BertForSequenceClassification
from torch.utils.data import DataLoader, RandomSampler, SequentialSampler
from transformers import AdamW, get_linear_schedule_with_warmup
from collections import ChainMap,OrderedDict
import itertools




def open_dbconn(collection):
    connection = MongoClient('127.0.0.1',27017) 
    db = connection['AIinCapacity']
    db_IngestedData = db[collection]
    return connection,db_IngestedData   


def sent_vectorizer(sent, model):
    sent_vec =[]
    numw = 0
    for w in sent:
        try:
            if numw == 0:
                sent_vec = model[w]
            else:
                sent_vec = np.add(sent_vec, model[w])
            numw+=1
        except:
            pass
     
    return np.asarray(sent_vec) / numw

def is_abbrev(abbrev, text):
    pattern = "(|.*\s)".join(abbrev.lower())
    return re.match("^" + pattern, text.lower()) is not None

def levenshtein_ratio_and_distance(s, t, ratio_calc = False):
    rows = len(s)+1
    cols = len(t)+1
    distance = np.zeros((rows,cols),dtype = int)
    for i in range(1, rows):
        for k in range(1,cols):
            distance[i][0] = i
            distance[0][k] = k

    for col in range(1, cols):
        for row in range(1, rows):
            if s[row-1] == t[col-1]:
                cost = 0 
            else:
                if ratio_calc == True:
                    cost = 2
                else:
                    cost = 1
            distance[row][col] = min(distance[row-1][col] + 1,   
                                 distance[row][col-1] + 1,        
                                 distance[row-1][col-1] + cost)
    if ratio_calc == True:
        Ratio = ((len(s)+len(t)) - distance[row][col]) / (len(s)+len(t))
        return Ratio
    else:
        return "The strings are {} edits away".format(distance[row][col])


def req_skills_t(req_skills,skill_repo):
    req_skills_t1 = [x.lower() for x in req_skills if str(x)!='nan']
    req_skills_t = [x for x in req_skills_t1 if x in skill_repo]
    req_diff = np.setdiff1d(req_skills_t1,req_skills_t)
    
    if len(req_diff) > 0:
        for x in req_diff:
            sim = []
            for itm1 in skill_repo:
                if is_abbrev(x, itm1):
                    sim.append(itm1)
                    req_skills_t.append(itm1)
            if len(sim) == 0:
                sim_skill_l = []
                l_sim_per = []
                l_sim_itm1 = []
                for itm1 in skill_repo:
                    sim_per = levenshtein_ratio_and_distance(itm1.lower(),x.lower(),ratio_calc = True)
                    if sim_per > 0.65:
                        l_sim_per.append(sim_per)
                        l_sim_itm1.append(itm1)
                if len(l_sim_itm1) > 0:
                    sim_skill_l.append(l_sim_itm1[l_sim_per.index(max(l_sim_per))])
                    req_skills_t.append(sim_skill_l[0])
    return req_skills_t

def inv_rank(x):
    if x == 1:
        return 5
    elif x == 2:
        return 4
    elif x == 3:
        return 3
    elif x ==4:
        return 2
    elif x == 5:
        return 1

req_rank=0
def scale_rank(x):
    if x==req_rank:
        return 1
    elif x < req_rank:
        return 0.9
    elif x > req_rank:
        return 0.8 
    else:
        return 0

req_exp = 0
def scale_exp(x):
    if x in range(int(req_exp),int(req_exp)+1):
        return 1
    elif x < req_exp:
        return 0.9
    elif x > req_exp:
        return 0.8

def flat_merge(x):
    return list(set(list(itertools.chain(*x))))

    
def main(Id):    
    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.insert_many([{"_id" : Id,  
                               'Status' : 'P',
                               'Progress': 10}])
    dbconn.close()
    
    dbconn,dbcollection = open_dbconn('demandRequest_collection')    
    input_l = list(dbcollection.find({"_id" :ObjectId(Id)}))
    input_l1 = input_l[0].get('appData')
    dbconn.close()
    if len(input_l1) > 1:
        input_df = pd.DataFrame([input_l1])
    else:            
        x5 = json.loads(list(input_l1.keys())[0])
        column_names = x5.pop(0)
        input_df = pd.DataFrame(x5, columns=column_names)
    
    input_df.replace(r'^\s*$', np.nan, regex=True,inplace=True)
    input_df = input_df.mask(input_df.applymap(str).eq('[]'))
    input_df = input_df.dropna(axis=1,how='all')
    input_df = input_df.loc[(input_df!=0).any(1), (input_df!=0).any(0)]
    
    if 'Location_Weightage' in list(input_df.columns):
        form = True
    else:
        form = False
    
    input_df.rename(columns={'requestor':'Requestor','rank':'Rank', "no_of_resource_required":"No of Resources_required", \
     'location':'Location','Years_of_Experience':'Years of experience','Rank_Weightage':'Rank Weightage', \
     'Bench_Ageing_Weightage':'Bench Ageing (weeks) Weightage', \
     'Location_Weightage':'Location Weightage', \
     'Years_of_Experience_Weightage':'Years of Experience Weightage'},inplace=True)
    
    input_df.columns = input_df.columns.str.replace('_', ' ')
    
    input_cols = list(input_df.columns)

    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'P',
                                         'Progress': 20}})
    dbconn.close()
    
    req_weights_cols = []
    req_skills_cols=[]
    for itm in input_cols:
        if 'Skill' in itm and 'Weightage' not in itm:
            req_skills_cols.append(itm)
        if 'Weightage' in itm:
            req_weights_cols.append(itm)
    req_skills_cols.sort()
    
    input_df[req_weights_cols] = input_df[req_weights_cols].apply(pd.to_numeric)
    input_df[['Years of experience','No of Resources required']] = input_df[['Years of experience','No of Resources required']].apply(pd.to_numeric)
    
    req_skills_cat=[]
    for itm in req_weights_cols:
        if 'Skill' in itm:
            req_skills_cat.append(itm.split('Skill')[0].strip().lower())
    req_skills_cat.sort()

    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'P',
                                         'Progress': 25}})
    dbconn.close()

    req_weights = {}
    req_skills = {}
    req_ip_t = {}
    req_oth_skills={}
    for idx,row in input_df.iterrows():
        req_weights_sub = []
        req_oth_skills_t = {}
        for itm in req_weights_cols:
            req_weights_sub.append({itm.lower():row[itm]})
            if itm not in ['Location Weightage','Years of Experience Weightage','Rank Weightage','Bench Ageing (weeks) Weightage']:
                req_oth_skills_t.update({itm:row[itm]})
        req_weights.update({row['Requestor']:req_weights_sub})
        req_oth_skills.update({row['Requestor']:req_oth_skills_t})
        req_ip_t.update({row['Requestor']:{'Location':row['Location'],
                                           'Rank':row['Rank'],
                                           'Years of experience':row['Years of experience']}})
        
        req_skills_sub = {}
        for itm1 in req_skills_cat:
            req_skills_sub1 = []
            for itm2 in req_skills_cols:
                if itm1 in itm2.lower():
                    req_skills_sub1.append(row[itm2]) 
            req_skills_sub.update({itm1:req_skills_sub1})
        req_skills.update({row['Requestor']:req_skills_sub})
    
    dbconn,dbcollection = open_dbconn('employeeData_collection')
    x=list(dbcollection.find({}))
    supplydata = pd.DataFrame(x)
    dbconn.close()
    supplydata.drop('_id',axis=1,inplace=True)
    supplydata.columns = ['Name/ID', 'Primary Unit', 'Sub Unit 1', 'Sub Unit 2', 'Sub Unit 3', 'Skill', 'Skill Level', 'Years of experience', 'Rank', 'Service Line', 'Sub Service Line', 'SMU', 'Country', 'City', 'Bench Ageing (weeks)']
    
    supplydata['Sub Unit 1'] = supplydata['Sub Unit 1'].str.lower()
    supplydata['Skill'] = supplydata['Skill'].str.lower()
    supplydata_t = supplydata[['Name/ID','Bench Ageing (weeks)','Years of experience','City','Rank']].drop_duplicates()

    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'P',
                                         'Progress': 30}})
    dbconn.close()
    
    # Creating emp_skills_df
    id_grp_data = supplydata.groupby('Name/ID')
    emp_skills_t = []
    for grp in id_grp_data.Skill:
        skills_l=None
        skills_l = [x for x in list(grp[1]) if str(x) != 'NaN']
        skills_l = [x for x in list(grp[1]) if str(x) != 'nan']
        skills_l =[x.lower() for x in skills_l]
        emp_skills_t.append({'Name/ID':grp[0],'Skills':skills_l})    
    emp_skills_dft = pd.DataFrame(emp_skills_t)
    
    su2emp_skills_t = []
    for grp in id_grp_data['Sub Unit 2']: #, 'Sub Unit 3',
        su2skills_l=None
        su2skills_l = [x for x in list(grp[1]) if str(x) != 'NaN']
        su2skills_l = [x for x in list(grp[1]) if str(x) != 'nan']
        su2skills_l =[x.lower() for x in su2skills_l]
        su2emp_skills_t.append({'Name/ID':grp[0],'su2 Skills':su2skills_l})    
    su2emp_skills_df = pd.DataFrame(su2emp_skills_t)
    
    su3emp_skills_t = []
    for grp in id_grp_data['Sub Unit 3']: 
        su3skills_l=None
        su3skills_l = [x for x in list(grp[1]) if str(x) != 'NaN']
        su3skills_l = [x for x in list(grp[1]) if str(x) != 'nan']
        su3skills_l =[x.lower() for x in su2skills_l]
        su3emp_skills_t.append({'Name/ID':grp[0],'su3 Skills':su3skills_l})    
    su3emp_skills_df = pd.DataFrame(su3emp_skills_t)
    
    skill_merge = pd.merge(emp_skills_dft,su2emp_skills_df,on='Name/ID') 
    emp_skills_df = pd.merge(skill_merge,su3emp_skills_df,on='Name/ID') 
    emp_skills_df['merge'] = emp_skills_df[['Skills', 'su2 Skills','su3 Skills']].apply(lambda x: list(x), axis = 1)
    
    emp_skills_df['flat_merge'] = emp_skills_df['merge'].apply(flat_merge)
    emp_skills_df.rename(columns={'Skills':'Skillst',
                                 'flat_merge':'Skills'}, inplace=True)
        
    su1_grp_data = supplydata.groupby('Sub Unit 1')
    skills_l = None
    su1_skill_t = []
    for su1grp in su1_grp_data:
        skills_l = list(su1grp[1]['Skill'])
        skills_l = [x for x in list(skills_l) if str(x) != 'NaN']
        skills_l = [x for x in list(skills_l) if str(x) != 'nan']
        su1_skill_t.append({'sub_unit1':su1grp[0],'skills':skills_l})
    su1_skill_df = pd.DataFrame(su1_skill_t)
    
    model = Word2Vec(list(emp_skills_df.Skills), min_count=1,size = 50)
    
    skill_repo = list(model.wv.vocab)

    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'P',
                                         'Progress': 40}})
    dbconn.close()

    result = pd.DataFrame()
    for idx,req_row in input_df.iterrows():
        req_skills_sub = {}
        for itm1 in req_skills_cat:
            req_skills_sub1 = []
            for itm2 in req_skills_cols:
                if itm1 in itm2.lower():
                    if str(req_row[itm2]) != 'nan':
                        if str(req_row[itm2]) != 'None': 
                            req_skills_sub1.append(req_row[itm2]) 
            if form:
                req_skills_sub.update({itm1:req_skills_sub1[0]})
            else:
                req_skills_sub.update({itm1:req_skills_sub1})
                
        sim_skill = []
        emp_skill_match = []
        for idx,row in emp_skills_df.iterrows():
            emp_skills = row.Skills
            emp_skills.sort()
            sim_skill_t = []
            emp_skill_match_t = []

            for key,value in req_skills_sub.items():
                req_det_f = req_skills_t(value,skill_repo)
                if len(req_det_f) > 0:
                    req_det_f.sort()
                    emp_skill_cat_inter = list(set(emp_skills) & set(req_det_f))
                    if len(emp_skill_cat_inter)>0:
                        sim_skill_t.append({key:model.n_similarity(emp_skill_cat_inter,req_det_f)})
                        emp_skill_match_t.append({key:emp_skill_cat_inter})
                    else:
                        sim_skill_t.append({key:0})
                        emp_skill_match_t.append({key:emp_skill_cat_inter})
                else:
                    sim_skill_t.append({key:0})
                    emp_skill_match_t.append({key:[]})
            
            sim_skill_t = dict(ChainMap(*sim_skill_t))
            sim_skill.append({**{'Name/ID':row['Name/ID']},**(sim_skill_t)})
            
            emp_skill_match_t = dict(ChainMap(*emp_skill_match_t))
            emp_skill_match.append({**{'Name/ID':row['Name/ID']},**(emp_skill_match_t)})
            
        ds_df = pd.DataFrame(sim_skill)
        emp_match_skill_df = pd.DataFrame(emp_skill_match)
        ds_df_t = pd.merge(ds_df,supplydata_t, on='Name/ID')
        ds_df_t['City'] = np.where(ds_df_t['City']==req_row['Location'], 1, 0.9)
        ds_df_t['Rank'] = ds_df_t['Rank'].str.replace('Rank_', '').astype(int)    
        ds_df_t['Rank'] = ds_df_t['Rank'].apply(inv_rank)
        global req_rank
        if form:
            req_rank = int(req_row['Rank'].replace('Rank', '').strip())
        else:
            req_rank = int(req_row['Rank'].replace('Rank_', '').strip())
        ds_df_t['Rank'] = ds_df_t['Rank'].apply(scale_rank)
        global req_exp 
        req_exp = req_row['Years of experience']
        ds_df_t['Years of experience'] = ds_df_t['Years of experience'].apply(scale_exp)
        
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()
        ds_df_t['Bench Ageing (weeks)'] = scaler.fit_transform(np.array(ds_df_t['Bench Ageing (weeks)']).reshape(-1, 1)) #.apply(scale_bage)
        
        
        ds_df_t['Bench Ageing (weeks)']=ds_df_t['Bench Ageing (weeks)']*req_row['Bench Ageing (weeks) Weightage']/100
        ds_df_t['Years of experience']=ds_df_t['Years of experience']*req_row['Years of Experience Weightage']/100
        ds_df_t['City']=ds_df_t['City']*req_row['Location Weightage']/100
        ds_df_t['Rank']=ds_df_t['Rank']*req_row['Rank Weightage']/100
        
        std_cols = ['Bench Ageing (weeks)','Years of experience','City','Rank']
        diff_cols = list(np.setdiff1d(list(ds_df_t.columns),std_cols))
        diff_cols.remove('Name/ID')
        diff_cols.sort()
    
        reqid_oth_skills= req_oth_skills.get(req_row['Requestor'])
        reqid_oth_skills = OrderedDict(sorted(reqid_oth_skills.items()))
        
        ds_df_t[diff_cols] = ds_df_t[diff_cols]*tuple(i/100 for i in tuple(reqid_oth_skills.values()))
    
        ds_df_tf = ds_df_t[ds_df_t.columns[~ds_df_t.columns.isin(['Name/ID'])]]
    
        ds_df_t['fitment'] = ds_df_tf.sum(axis=1)
        ds_df_t.loc[ds_df_t[diff_cols].sum(axis=1) == 0 , 'fitment'] = 0
        
        ds_df_tt = pd.merge(ds_df_t,emp_match_skill_df,on='Name/ID')
        ds_df_tt1 = pd.merge(ds_df_tt,supplydata_t,on='Name/ID')
           
        ds_df_t_f1 = ds_df_tt1.sort_values('fitment',ascending=False)[:int(req_row['No of Resources required'])]
        ds_df_t_f1['Request'] = req_row['Requestor']        
        
        result = pd.concat([result,ds_df_t_f1])
    #print('Printing Results')
    #print(result)      
    
    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'P',
                                         'Progress': 70}})
    dbconn.close()    
    
    dbconn,dbcollection = open_dbconn('employeeEngagements_collection')
    eel=list(dbcollection.find({}))
    emp_eng_df = pd.DataFrame(eel)
    dbconn.close()
    #print('Printing emp_eng_df')
    #print(emp_eng_df)      

               
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', 
                                          do_lower_case=True)
    bmodel = BertForSequenceClassification.from_pretrained("bert-base-uncased",
                                                          num_labels= 3,
                                                          output_attentions=False,
                                                          output_hidden_states=False)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    bmodel.to(device)
    bmodel.load_state_dict(torch.load("public/python/finetuned_BERT_epoch_2.model", map_location=torch.device('cpu')))
    
    result.rename(columns={'Name/ID':'Name_ID'},inplace=True)   
    result.reset_index(drop=True,inplace=True)
    result['Reviews']= None
    for indr,rowr in result.iterrows():
        rowr['Reviews'] = indr
        emp_rev = {}
        emp_review = emp_eng_df[emp_eng_df.Name_ID==rowr['Name_ID']]
        for idxe,rowe in emp_review.iterrows():
            
            tokens = tokenizer.batch_encode_plus([rowe['Review']],
                                                       max_length = 256,
                                                       pad_to_max_length=True,
                                                       truncation=True)
                                                        
            test_seq = torch.tensor(tokens['input_ids'])
            test_mask = torch.tensor(tokens['attention_mask'])
            
            with torch.no_grad():
              preds = bmodel(test_seq.to(device), test_mask.to(device))

#            0=neg, 1=pos, 2 = neu
            preds = preds[0].tolist() 
            preds = np.argmax(preds, axis = 1)
            
            ratings = 1
            if preds == 0:
                ratings=0
            elif preds == 1:
                ratings = 2
            elif preds == 2:
                ratings = 1
                
            emp_rev.update({rowe['EngagementName']:ratings})
        reivews_f = []
        for keyr,valuer in emp_rev.items():
            reivews_f.append({"EngagementName": keyr, "Rating":valuer}), 
        result.at[indr,'Reviews'] = reivews_f
     
    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'P',
                                         'Progress': 90}})
    dbconn.close()   
    
    print(result)
    dbconn,dbcollection = open_dbconn('fitmentResults_collection')
    data_dict = result.to_dict("records")
    dbcollection.insert_many([{"_id" : Id,  
                               'fitmentresults' : data_dict}])
    dbconn.close() 
    dbconn,dbcollection = open_dbconn('requestQueue_collection')    
    dbcollection.update_many({"_id" : Id},{'$set':
                                        {'Status' : 'C',
                                         'Progress': 100}})
    dbconn.close()
    print("Completed")


if len(sys.argv)>1:
    Id = sys.argv[1] 
#breakpoint()
#Id = '5f4ac56253eee42d544a3444'  #form
#Id = '5f4a61c1c0fbde5c5422e64c' #bulk upload

try:
#    print(type(Id))
#    print(str(Id))
    import pickle
    with open('filename.pickle', 'wb') as handle:
        pickle.dump(Id, handle, protocol=pickle.HIGHEST_PROTOCOL)
    Id1 = json.loads(Id)
    print(Id1)
    main(Id1)
except Exception as err:
    print(traceback.format_exc())
    
    