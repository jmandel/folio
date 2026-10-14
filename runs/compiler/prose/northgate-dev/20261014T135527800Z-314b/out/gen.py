import json
items = []
def add(i, facts): items.append({"item_id": i, "facts": facts})
def prob(c, ref, q, **k): return {"view":"problems","condition":c,"status":"active","ref":ref,"quote":q,**k}
def med(ing, st, dose, ref, q):
    f={"view":"medications","ingredient":ing,"status":st,"ref":ref,"quote":q}
    if dose: f["dose"]={"value":dose,"unit":"mg"}
    return f
def lab(a, v, d, ref, q):
    f={"view":"labs","analyte":a,"value":v,"ref":ref,"quote":q}
    if d: f["date"]=d
    return f

add("01FMX033A0EA15JPK2343K8J2H",[prob("Hyperlipidemia","prob_1","Hyperlipidemia, onset 2017.")])
add("01JBYEP7E0R3SKEPCCPG5A15AJ",[prob("Type 2 diabetes mellitus","prob_1","DM2 since 4/2016 per pt.")])
add("01F251F2QGP2HSH0AABRJVEE4X",[med("lisinopril","active",40,"med_1","Lisinopril increased to 40 mg daily.")])
add("01JJQG9EBGY3EG66ZWXS32XTCF",[
 prob("Chronic kidney disease stage 3b","prob_1","CKD 3b",ckd_stage="G3b"),
 lab("egfr",44,"2024-10-29","prob_1","eGFR 44 on 10/29/24"),
 lab("egfr",40,"2025-01-28","prob_1","40 today"),
 lab("uacr",329,"2024-07-08","prob_1","UACR 329 mg/g on 7/8/24")])
add("01JBA2YGM09F8DSSSYR966F7Z3",[prob("Hyperlipidemia","prob_1","Hyperlipidemia, onset 2016 per pt.")])
add("01J5BM3QB05N7PJ7EYR9NBY5F2",[prob("Major depressive disorder, recurrent, mild","prob_1","Major depressive disorder, recurrent, mild.")])
add("01HWDVPW503EA7WRV9VZRPEM6K",[prob("Hyperlipidemia","prob_1","Hyperlipidemia, onset 2021.")])
add("01HX7K36MGXD8XZY226TMJQ577",[med("chlorthalidone","active",12.5,"med_1","Chlorthalidone 12.5 mg daily started today.")])
add("01JM019N40ZSTWJBEWHE2EJWFV",[
 prob("Chronic kidney disease stage 3a","prob_1","Added CKD 3a.",ckd_stage="G3a"),
 lab("egfr",60,"2024-06-27","prob_1","eGFR 60 on 6/27/24"),
 lab("egfr",58,"2025-02-13","prob_1","58 today"),
 lab("uacr",13,"2023-11-20","prob_1","UACR 13 on 11/20/23")])
add("01KMGG7TKGAGQJ89JQ6PK729DS",[{"view":"allergies","substance":"lisinopril","reaction_type":"side_effect","ref":"alg_1","quote":"Dry cough on lisinopril."}])
add("01DZ4ZQK60Z7BFNSKV4J79RXBN",[prob("Essential hypertension","prob_1","Essential HTN, onset 2016 per pt.")])
add("01GRYMEB20GMX1ENPCF73ASGX4",[prob("Hypertension","prob_1","HTN since 2010 per pt.")])
add("01JE6PNEAG3FQA994HMVMCMZAG",[med("metformin","held",None,"med_1","Metformin held today for vomiting and poor oral intake.")])
add("01HWV89FB0D13YS7WMT56C113S",[
 {"view":"vitals","systolic_mmhg":142,"diastolic_mmhg":84,"ref":None,"quote":"BP 142/84, repeat 140/84"},
 lab("egfr",74,"2024-05-01",None,"Today eGFR 74"),
 lab("uacr",9,"2024-05-01",None,"UACR 9 mg/g"),
 lab("a1c",7.2,"2024-05-01",None,"A1c 7.2%"),
 lab("potassium",4.5,"2024-05-01",None,"repeat K 4.5")])
add("01H8CS8V00DQK8X0ZHMWT4969B",[
 prob("Chronic kidney disease stage 3a","referral","chronic kidney disease stage 3a",ckd_stage="G3a"),
 prob("Type 2 diabetes mellitus","referral","type 2 diabetes mellitus"),
 lab("egfr",59,None,"referral","Most recent eGFR is 59"),
 lab("uacr",311,None,"referral","UACR 311 mg/g")])
add("01JCH3G480864ZS1QY1QZ3NCD5",[prob("Essential hypertension","prob_1","Essential HTN, onset ~1/2011.")])
add("01HSVCCXVGV8YW3VMG8NK83182",[med("chlorthalidone","active",12.5,"med_1","Chlorthalidone 12.5 mg daily started today.")])
add("01HKQDWSRG0WT2SRQGR0E770M9",[med("losartan","active",100,"med_1","Losartan increased to 100 mg daily.")])
add("01FX0ZYEJ0016GY0AT3KFC99JN",[prob("Hyperlipidemia","prob_1","Hyperlipidemia, onset 2017 per pt.")])
add("01HQXTKDK0KNCKSK729J9MXR74",[prob("Primary osteoarthritis of knee","prob_1","Primary osteoarthritis of knee, onset 2021 per pt.")])
add("01JCH3S970M7TQH4STD6T53A7Z",[prob("Hyperlipidemia","prob_1","Hyperlipidemia, onset 5/2016 per pt.")])
add("01FW45HVA08BR1VK5YKQ76R903",[prob("Hyperlipidemia","prob_1","Hyperlipidemia, onset 2015 per pt.")])
add("01GXNRQ2T01BZQ1PBZW8RVM6M7",[
 prob("Chronic kidney disease stage 3b","prob_1","CKD 3b.",ckd_stage="G3b"),
 lab("egfr",41,"2022-12-06","prob_1","eGFR 41 on 12/6/22"),
 lab("egfr",45,"2023-04-10","prob_1","45 today"),
 lab("uacr",49,"2023-04-10","prob_1","UACR 49 mg/g today")])
add("01FJJ9D2VGDY2CWYVKNMXZ2QQM",[med("lisinopril","active",40,"med_1","Lisinopril increased to 40 mg daily.")])
add("01GK034T80YQN8SCZYVNJ88H2V",[
 {"view":"vitals","systolic_mmhg":128,"diastolic_mmhg":75,"ref":None,"quote":"BP 128/75"},
 lab("egfr",58,"2022-11-28",None,"eGFR 58"),
 lab("potassium",4.1,"2022-11-28",None,"K 4.1"),
 lab("a1c",7.4,"2022-11-28",None,"A1c 7.4%")])
add("01DE5B96B0P9VAQN2GGGN6AVNR",[prob("Essential hypertension","prob_1","Essential hypertension, onset 2008.")])
add("01HFWG0B10C62T0PQVTWF0X1KY",[prob("Essential hypertension","prob_1","Essential hypertension, onset 2016 per pt.")])
add("01DTSSP9P00XCGS17ECYVP92MW",[prob("Primary osteoarthritis of knee","prob_1","Primary osteoarthritis of knee, onset 2018.")])
add("01HVVGAHQGY2J2PTPZFBBFRB6H",[])
add("01JXZMJNEGH7TPXBKJTFBY5B4Z",[
 med("empagliflozin","active",10,"med_1","Empagliflozin 10 mg daily started today."),
 lab("a1c",8.4,None,"med_1","A1c 8.4")])
json.dump({"items":items},open("out/facts.json","w"),indent=1)
print(len(items))
