from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import numpy as np
import cv2

app = FastAPI()

#avg
worldExport=[22375597073.0, 25344124.0, 157062551.0, 134216826.6, 106977554.2, 11275232.8,25748753.8, 88468682.4, 145334395.6, 63792327.4, 154419145.2, 25773380.8,135437212.6, 9505484.6, 1615497.8, 145486768.6, 60063677.2, 57837144.0,62929823.8, 97482042.0, 78111552.8, 99425423.0, 142025844.4, 101679552.8,52362846.0, 56792397.8, 329623195.6, 2917974190.0, 177197486.0, 479742625.4,819518774.6, 90246616.0, 88741359.4, 170946888.6, 76466132.6, 39469156.0,5308403.4, 14930889.4, 279590899.2, 744016741.6, 213259369.2, 16673366.2,93437616.2, 4769155.4, 161421069.2, 2153284.4, 3163514.6, 51501635.6,187743614.0, 36559117.6, 1639417.2, 10634474.6, 56082637.2, 6022852.2,52806650.6, 35532790.6, 31045908.4, 17238460.6, 12104850.8, 27274231.6,38910270.2, 265693524.4, 240194225.6, 91161156.0, 161821625.4, 13488951.0,4083033.6, 13779013.6, 60552637.8, 67240546.4, 87831700.6, 869433082.0,478958293.4, 362943791.8, 204388345.8, 35850896.4, 234775763.8, 8477593.2,19126885.8, 7151777.0, 20912092.0, 72941295.0, 81646418.8, 2499648845.0,3367858173.0, 48466387.2, 1632499200.0, 267729442.2, 130094032.6,659752576.6, 54994498.4, 7942011.6, 21904292.4, 304070901.0, 157947895.2,61788309.2, 30382455.6, 395147783.2]
worldImport = [22707572243, 26352319.6, 157436689.8, 135905407.6, 108543091, 11288401.8, 23664625, 89981054.8, 157576582.4, 63712242, 171664663.8, 26557381.8, 147191456.2, 9273121.8, 1919792.4, 151844376.4, 54275013.4, 61726115.6, 63435760.8, 97835590.6, 76318481.4, 101710820.4, 144236229.4, 109057848.6, 52339687.6, 70216612, 371780991, 2994087079, 177413886.6, 525897459.2, 861596502, 102636423, 90985551.2, 173348965, 77836930.8, 40591175.2, 5570300.6, 14954492.4, 294512017.8, 741868258.4, 222910111.2, 17313529, 85358588, 3511226.2, 167748879.6, 2229591, 2490378.2, 60530200.6, 187695938, 37434772.2, 1410119.4, 10186988.6, 49746473.4, 5414834, 46055087, 36422387, 28588916, 15622625.2, 10380176.6, 24414278.8, 32477559, 231406121.6, 212053348.4, 84293488.2, 153217329.4, 12884001.8, 3346263.6, 7777306.8, 56382573.2, 55537506, 85187583.6, 887102498.8, 490412026.8, 347756126.4, 214197251.4, 38804497, 230210244.2, 8712981, 19703517.4, 7289587.6, 24935551, 69064114.6, 79748956.2, 2583713348, 3573273769, 32234842.8, 1645603968, 191969339.6, 78614734.2, 671368848.2, 54977006.2, 7900869.4, 17284690.6, 269825428, 146467974.4, 56204044.6, 29498289.2, 393525161]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return "aaa"
    
@app.get("/getOptionList")
def getOptionList(mode: str):
    base_path = f"./{mode}"
    try:
        optionList = [name for name in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, name))]
        return {"optionList": optionList}
    except Exception as e:
        print("err?")
        return {"error": str(e)}
    
@app.get("/getRawdata")
def gen(nation: str = Query(...), mode: str = Query(...)):
    print("aaa")
    filepath = f"./{mode}/{nation}/{nation}.csv"
    print(filepath)
    if not os.path.exists(filepath):
        return {"error": f"File not found: {filepath}"}
    df = pd.read_csv(filepath)
    print(df)
    return{
        "columns": df.columns.tolist(),
        "data": df.values.tolist()
    }


@app.get("/gen")
def gen(filename: list[str] = Query(...), mode: str = Query(...)):
    #df = pd.read_csv("RCA/world/world.csv")
    #data = [df["Product code"].tolist(), df["Product label"].tolist()]
    #print(data)
    #auto
    print(mode)
    data=[]
    data2 = [ ["Product code", "Product label"], ["01", "Live animals"], ["02", "Meat and edible meat offal"],["03", "Fish and crustaceans, molluscs and other aquatic invertebrates"],["04", "Dairy produce; birds' eggs; natural honey; edible products of animal origin, not elsewhere ..."],["05", "Products of animal origin, not elsewhere specified or included"],["06", "Live trees and other plants; bulbs, roots and the like; cut flowers and ornamental foliage"],["07", "Edible vegetables and certain roots and tubers"],["08", "Edible fruit and nuts; peel of citrus fruit or melons"],["09", "Coffee, tea, maté and spices"],["10", "Cereals"],["11", "Products of the milling industry; malt; starches; inulin; wheat gluten"],["12", "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit; industrial or medicinal ..."],["13", "Lac; gums, resins and other vegetable saps and extracts"],["14", "Vegetable plaiting materials; vegetable products not elsewhere specified or included"],["15", "Animal, vegetable or microbial fats and oils and their cleavage products; prepared edible fats; ..."],["16", "Preparations of meat, of fish, of crustaceans, molluscs or other aquatic invertebrates, or ..."],["17", "Sugars and sugar confectionery"],["18", "Cocoa and cocoa preparations"],["19", "Preparations of cereals, flour, starch or milk; pastrycooks' products"],["20", "Preparations of vegetables, fruit, nuts or other parts of plants"],["21", "Miscellaneous edible preparations"],["22", "Beverages, spirits and vinegar"],["23", "Residues and waste from the food industries; prepared animal fodder"],["24", "Tobacco and manufactured tobacco substitutes; products, whether or not containing nicotine, ..."],["25", "Salt; sulphur; earths and stone; plastering materials, lime and cement"],["26", "Ores, slag and ash"],["27", "Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral ..."],["28", "Inorganic chemicals; organic or inorganic compounds of precious metals, of rare-earth metals, ..."],["29", "Organic chemicals"],["30", "Pharmaceutical products"],["31", "Fertilisers"],["32", "Tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring ..."],["33", "Essential oils and resinoids; perfumery, cosmetic or toilet preparations"],["34", "Soap, organic surface-active agents, washing preparations, lubricating preparations, artificial ..."],["35", "Albuminoidal substances; modified starches; glues; enzymes"],["36", "Explosives; pyrotechnic products; matches; pyrophoric alloys; certain combustible preparations"],["37", "Photographic or cinematographic goods"],["38", "Miscellaneous chemical products"],["39", "Plastics and articles thereof"],["40", "Rubber and articles thereof"],["41", "Raw hides and skins (other than furskins) and leather"],["42", "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles ..."],["43", "Furskins and artificial fur; manufactures thereof"],["44", "Wood and articles of wood; wood charcoal"],["45", "Cork and articles of cork"],["46", "Manufactures of straw, of esparto or of other plaiting materials; basketware and wickerwork"],["47", "Pulp of wood or of other fibrous cellulosic material; recovered (waste and scrap) paper or ..."],["48", "Paper and paperboard; articles of paper pulp, of paper or of paperboard"],["49", "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, ..."],["50", "Silk"],["51", "Wool, fine or coarse animal hair; horsehair yarn and woven fabric"],["52", "Cotton"],["53", "Other vegetable textile fibres; paper yarn and woven fabrics of paper yarn"],["54", "Man-made filaments; strip and the like of man-made textile materials"],["55", "Man-made staple fibres"],["56", "Wadding, felt and nonwovens; special yarns; twine, cordage, ropes and cables and articles thereof"],["57", "Carpets and other textile floor coverings"],["58", "Special woven fabrics; tufted textile fabrics; lace; tapestries; trimmings; embroidery"],["59", "Impregnated, coated, covered or laminated textile fabrics; textile articles of a kind suitable ..."],["60", "Knitted or crocheted fabrics"],["61", "Articles of apparel and clothing accessories, knitted or crocheted"],["62", "Articles of apparel and clothing accessories, not knitted or crocheted"],["63", "Other made-up textile articles; sets; worn clothing and worn textile articles; rags"],["64", "Footwear, gaiters and the like; parts of such articles"],["65", "Headgear and parts thereof"],["66", "Umbrellas, sun umbrellas, walking sticks, seat-sticks, whips, riding-crops and parts thereof"],["67", "Prepared feathers and down and articles made of feathers or of down; artificial flowers; articles ..."],["68", "Articles of stone, plaster, cement, asbestos, mica or similar materials"],["69", "Ceramic products"],["70", "Glass and glassware"],["71", "Natural or cultured pearls, precious or semi-precious stones, precious metals, metals clad ..."],["72", "Iron and steel"],["73", "Articles of iron or steel"],["74", "Copper and articles thereof"],["75", "Nickel and articles thereof"],["76", "Aluminium and articles thereof"],["78", "Lead and articles thereof"],["79", "Zinc and articles thereof"],["80", "Tin and articles thereof"],["81", "Other base metals; cermets; articles thereof"],["82", "Tools, implements, cutlery, spoons and forks, of base metal; parts thereof of base metal"],["83", "Miscellaneous articles of base metal"],["84", "Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof"],["85", "Electrical machinery and equipment and parts thereof; sound recorders and reproducers, television ..."],["86", "Railway or tramway locomotives, rolling stock and parts thereof; railway or tramway track fixtures ..."],["87", "Vehicles other than railway or tramway rolling stock, and parts and accessories thereof"],["88", "Aircraft, spacecraft, and parts thereof"],["89", "Ships, boats and floating structures"],["90", "Optical, photographic, cinematographic, measuring, checking, precision, medical or surgical ..."],["91", "Clocks and watches and parts thereof"],["92", "Musical instruments; parts and accessories of such articles"],["93", "Arms and ammunition; parts and accessories thereof"],["94", "Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings; ..."],["95", "Toys, games and sports requisites; parts and accessories thereof"],["96", "Miscellaneous manufactured articles"],["97", "Works of art, collectors' pieces and antiques"],["99", "Commodities not elsewhere specified"]];
    for     name in filename:
        filepath = f"./{mode}/{name}/{name}.csv"
        if not os.path.exists(filepath):
            return {"error": f"File not found: {filepath}"}
        df = pd.read_csv(filepath)
        temp=(df["average"].tolist())
        if(mode=="RCA"):
            world=worldExport
        if(mode=="RCD"):
            world=worldImport
        memo=world[0]/temp[0]
        for i in range(1, len(temp)):
            temp[i]=(temp[i]/world[i])*memo
        data.append(temp[1:])
        
    result_df = pd.DataFrame(data, index=filename).T
    df_data2 = pd.DataFrame(data2[1:], columns=data2[0])
    data = pd.concat([df_data2, result_df], axis=1)
    return{
        "columns": data.columns.tolist(),
        "data": data.values.tolist()
    }
