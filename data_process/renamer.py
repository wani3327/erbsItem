from database_api import itemdb
import os

path = 'image/item_old/'
newpath = 'image/item/'

for filename in os.listdir(path):
    for c in itemdb:
        if itemdb[c][0][1] == filename.replace('.webp', ''):
            print(path+filename, '=>', newpath+str(c)+'.webp')
            os.rename(path+filename, newpath+str(c)+'.webp')






# 출처: https://data-make.tistory.com/171 [Data Makes Our Future]