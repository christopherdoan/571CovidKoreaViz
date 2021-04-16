import csv
import pandas as pd
import os

filesToRead = ['data/Time.csv', 'data/TimeAge.csv', 'data/TimeGender.csv', 'data/ConfirmedData.csv', 'data/DeceasedData.csv']

dataframes = [] 
for filename in filesToRead: 
    dataframes.append(pd.read_csv(filename)) 

#create iterable objects to extract data
timeCSV = dataframes[0].iterrows()
timeAgeCSV = dataframes[1].iterrows()
timeGenderCSV = dataframes[2].iterrows()

timeGenderVal = next(timeGenderCSV)[1]
timeAge = next(timeAgeCSV)[1]

for cnt in range(len(dataframes[0])-1):
    date = 0
    total_c = 0
    male_c = 0
    female_c = 0
    age_0_c = 0
    age_10_c = 0
    age_20_c = 0
    age_30_c = 0
    age_40_c = 0
    age_50_c = 0
    age_60_c = 0
    age_70_c = 0
    age_80_c = 0

    total_d = 0
    male_d = 0
    female_d = 0
    age_0_d = 0
    age_10_d = 0
    age_20_d = 0
    age_30_d = 0
    age_40_d = 0
    age_50_d = 0
    age_60_d = 0
    age_70_d = 0
    age_80_d = 0


    timeVal = next(timeCSV)[1]

    date = timeVal.date
    total_c = timeVal.confirmed
    total_d = timeVal.deceased
    
    #set gender column counts
    if date == timeGenderVal.date and timeGenderVal.sex == 'male':
        male_c = timeGenderVal.confirmed
        male_d = timeGenderVal.deceased
        timeGenderVal = next(timeGenderCSV)[1]
        if date == timeGenderVal.date and timeGenderVal.sex == 'female':
            female_c = timeGenderVal.confirmed
            female_d = timeGenderVal.deceased
            timeGenderVal = next(timeGenderCSV)[1]
    
    
    #set age counts
    if date == timeAge.date and timeAge.age == '0s':
        age_0_c = timeAge.confirmed
        age_0_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '10s':
        age_10_c = timeAge.confirmed
        age_10_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '20s':
        age_20_c = timeAge.confirmed
        age_20_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '30s':
        age_30_c = timeAge.confirmed
        age_30_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '40s':
        age_40_c = timeAge.confirmed
        age_40_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '50s':
        age_50_c = timeAge.confirmed
        age_50_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '60s':
        age_60_c = timeAge.confirmed
        age_60_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '70s':
        age_70_c = timeAge.confirmed
        age_70_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]
    if date == timeAge.date and timeAge.age == '80s':
        age_80_c = timeAge.confirmed
        age_80_d = timeAge.deceased
        timeAge = next(timeAgeCSV)[1]

    conf_row = {'date': date, 'total': total_c, 'male': male_c, 'female': female_c, 'age_0':age_0_c, 'age_10':age_10_c, 'age_20': age_20_c, 'age_30': age_30_c, 'age_40': age_40_c, 'age_50': age_50_c, 'age_60': age_60_c, 'age_70': age_70_c, 'age_80': age_80_c}
    dec_row = {'date': date, 'total': total_d, 'male': male_d, 'female': female_d, 'age_0':age_0_d, 'age_10':age_10_d, 'age_20': age_20_d, 'age_30': age_30_d, 'age_40': age_40_d, 'age_50': age_50_d, 'age_60': age_60_d, 'age_70': age_70_d, 'age_80': age_80_d}
    dataframes[3] = dataframes[3].append(conf_row, ignore_index=True, sort=False)
    dataframes[4] = dataframes[4].append(dec_row, ignore_index=True, sort=False)

dataframes[3].to_csv(r'C:\Users\Corey\Documents\571CovidKoreaViz\data\ConfirmedData.csv', index=False, header=True)
dataframes[4].to_csv(r'C:\Users\Corey\Documents\571CovidKoreaViz\data\DeceasedData.csv', index=False, header=True)
   