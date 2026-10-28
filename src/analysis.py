import numpy as np, pandas as pd, plotly.express as px
df=px.data.gapminder()
df['gdp_total']=df.gdpPercap*df['pop']
def wavg(g,c): return np.average(g[c],weights=g['pop'])
# global
for y in [1952,2007]:
    d=df[df.year==y]
    print(y,'pop-weighted LE',round(wavg(d,'lifeExp'),1),'median LE',d.lifeExp.median(),'mean',d.lifeExp.mean().round(1),
          'median gdp',d.gdpPercap.median().round(0),'min/max LE',d.lifeExp.min(),d.lifeExp.max())
print(df[df.year==2007].groupby('continent').apply(lambda g: pd.Series({'LE':wavg(g,'lifeExp'),'gdp':g.gdpPercap.median(),'n':len(g)})))
print(df[df.year==1952].groupby('continent').apply(lambda g: pd.Series({'LE':wavg(g,'lifeExp'),'gdp':g.gdpPercap.median(),'n':len(g)})))
# corr
for y in [1952,2007]:
    d=df[df.year==y]; print(y,'corr LE~log gdp',np.corrcoef(np.log10(d.gdpPercap),d.lifeExp)[0,1].round(3))
# gains
w=df.pivot(index='country',columns='year',values='lifeExp'); g=(w[2007]-w[1952]).sort_values()
print(g.head(5)); print(g.tail(8)); print('mean gain',g.mean())
# declines
df=df.sort_values(['country','year']); df['d']=df.groupby('country').lifeExp.diff()
print(df[df.d<-3][['country','year','lifeExp','d']].sort_values('d').head(25))
print('n declines',(df.d<0).sum(),'of',df.d.notna().sum())
# residuals 2007
d=df[df.year==2007].copy(); X=np.log10(d.gdpPercap); b,a=np.polyfit(X,d.lifeExp,1); d['res']=d.lifeExp-(a+b*X)
print('slope',b,'intercept',a, 'R2',np.corrcoef(X,d.lifeExp)[0,1]**2)
print(d.sort_values('res')[['country','lifeExp','gdpPercap','res']].head(8)); print(d.sort_values('res')[['country','lifeExp','gdpPercap','res']].tail(8))
# gap
for y in [1952,2007]:
    d=df[df.year==y]; print(y,'LE p90-p10',d.lifeExp.quantile(.9)-d.lifeExp.quantile(.1),'gdp p90/p10',d.gdpPercap.quantile(.9)/d.gdpPercap.quantile(.1), 'std LE',d.lifeExp.std())
# preston shift: LE at $1000, $10000 curves
for y in [1952,1977,2007]:
    d=df[df.year==y]; b,a=np.polyfit(np.log10(d.gdpPercap),d.lifeExp,1); print(y,'LE@1000',a+b*3,'LE@10000',a+b*4)
# china india
print(df[df.country.isin(['China','India','Nigeria','United States','Japan'])&df.year.isin([1952,2007])][['country','year','lifeExp','gdpPercap','pop']])
