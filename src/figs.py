import numpy as np, pandas as pd, plotly.express as px
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, seaborn as sns
from matplotlib.lines import Line2D
df=px.data.gapminder().rename(columns={'pop':'population'})
COL={'Africa':'#D1495B','Asia':'#EDAE49','Americas':'#00798C','Europe':'#30638E','Oceania':'#8D6B94'}
INK='#2B2D42'; GREY='#8D99AE'
plt.rcParams.update({'font.family':'DejaVu Sans','axes.edgecolor':GREY,'axes.labelcolor':INK,'text.color':INK,
 'xtick.color':INK,'ytick.color':INK,'axes.spines.top':False,'axes.spines.right':False,'figure.dpi':100,'savefig.dpi':200})
def wavg(g,c): return np.average(g[c],weights=g['population'])
def save(f,n): f.savefig(f'figures/{n}.png',bbox_inches='tight',facecolor='white'); plt.close(f)
xt=[500,1000,2000,5000,10000,20000,50000]

# FIG 1 bubble 1952 vs 2007
fig,axs=plt.subplots(1,2,figsize=(11,4.8),sharey=True)
for ax,y in zip(axs,[1952,2007]):
    d=df[df.year==y]
    ax.scatter(d.gdpPercap,d.lifeExp,s=d.population/d.population.max()*1800+8,c=d.continent.map(COL),alpha=.7,edgecolor='white',linewidth=.6)
    ax.set_xscale('log'); ax.set_xticks(xt); ax.set_xticklabels([f'${x:,}' for x in xt],fontsize=8,rotation=0)
    ax.set_xlim(250,70000); ax.set_ylim(22,88); ax.set_title(str(y),fontsize=15,fontweight='bold',loc='left')
    ax.set_xlabel('GDP per person (log scale, US$)'); ax.grid(alpha=.25)
    ax.axhline(d.lifeExp.median(),color=GREY,ls='--',lw=1)
    ax.text(*((70000,d.lifeExp.median()+.8) if y==1952 else (270,d.lifeExp.median()+.8)),f'median life expectancy: {d.lifeExp.median():.0f} yrs',ha=('right' if y==1952 else 'left'),fontsize=8.5,color=INK)
axs[0].set_ylabel('Life expectancy at birth (years)')
for n,xy in {'China':(400,44),'India':(546,37.4)}.items():
    pass
for ax,y in zip(axs,[1952,2007]):
    for c in ['China','India','United States','Nigeria']:
        r=df[(df.country==c)&(df.year==y)].iloc[0]; ax.annotate(c,(r.gdpPercap,r.lifeExp),xytext=(6,-14 if c in('India','Nigeria') else 12),textcoords='offset points',fontsize=8.5,fontweight='bold')
h=[Line2D([],[],marker='o',ls='',color=c,label=k,markersize=8) for k,c in COL.items()]
fig.legend(handles=h,loc='lower center',ncol=5,frameon=False,bbox_to_anchor=(.5,-.04))
fig.suptitle('Bubble size = population',fontsize=9,y=.0,x=.92,color=GREY)
fig.tight_layout(); save(fig,'fig1_bubble')

# FIG 2 split violin
sub=df[df.year.isin([1952,2007])&(df.continent!='Oceania')].copy(); sub['Year']=sub.year.astype(str)
order=['Africa','Asia','Americas','Europe']
fig,ax=plt.subplots(figsize=(9,4.8))
sns.violinplot(data=sub,x='continent',y='lifeExp',hue='Year',split=True,order=order,inner='quart',palette={'1952':'#B8C0D4','2007':'#30638E'},ax=ax,linewidth=1,cut=0)
ax.set_xlabel(''); ax.set_ylabel('Life expectancy at birth (years)'); ax.grid(axis='y',alpha=.25)
ax.legend(title='',frameon=False,loc='lower right')
for i,c in enumerate(order):
    a=sub[(sub.continent==c)&(sub.year==1952)].lifeExp.median(); b=sub[(sub.continent==c)&(sub.year==2007)].lifeExp.median()
    ax.text(i,86,f'median +{b-a:.0f} yrs',ha='center',fontsize=9.5,fontweight='bold',color=COL[c])
ax.set_ylim(25,90); fig.tight_layout(); save(fig,'fig2_violin')

# FIG 3 continent lines
cw=df.groupby(['continent','year']).apply(lambda g:wavg(g,'lifeExp'),include_groups=False).reset_index(name='lev')
fig,ax=plt.subplots(figsize=(9,4.8))
for c in ['Oceania','Europe','Americas','Asia','Africa']:
    d=cw[cw.continent==c]; ax.plot(d.year,d.lev,color=COL[c],lw=3,marker='o',ms=4)
    ax.text(2008.5,d.lev.iloc[-1],f'{c}  {d.lev.iloc[-1]:.0f}',color=COL[c],va='center',fontweight='bold',fontsize=10)
ax.set_xlim(1950,2022); ax.set_ylabel('Life expectancy (population-weighted, yrs)'); ax.grid(alpha=.25)
ax.annotate('Asia surges: 43 → 69 yrs\n(driven by China and India)',xy=(1982,61.4),xytext=(1983,56.3),fontsize=9,arrowprops=dict(arrowstyle='->',color=GREY))
ax.annotate('Africa\'s progress stalls\n1992–2002 (HIV/AIDS, conflict)',xy=(1997,53.1),xytext=(1983,44),fontsize=9,arrowprops=dict(arrowstyle='->',color=GREY))
fig.tight_layout(); save(fig,'fig3_lines')

# FIG 4 heatmap 5-year gains
p=cw.pivot(index='continent',columns='year',values='lev').loc[['Oceania','Europe','Americas','Asia','Africa']]
g=p.diff(axis=1).iloc[:,1:]; g.columns=[f"{c-5}–{str(c)[2:]}" for c in g.columns]
fig,ax=plt.subplots(figsize=(10,3.8))
sns.heatmap(g,annot=True,fmt='.1f',cmap=sns.diverging_palette(15,200,as_cmap=True),center=3,vmin=0,vmax=9,linewidths=1,linecolor='white',cbar_kws={'label':'Years gained in 5 yrs'},ax=ax,annot_kws={'fontsize':9})
ax.set_xlabel('5-year period'); ax.set_ylabel(''); plt.setp(ax.get_xticklabels(),rotation=0,fontsize=8.5)
fig.tight_layout(); save(fig,'fig4_heatmap')
print(g.round(1))

# FIG 5 anomalies
cs={'Rwanda':('#D1495B',(1992,23.6),'Rwanda 1992\n23.6 yrs (genocide)',(1994,22)),
    'Cambodia':('#EDAE49',(1977,31.2),'Cambodia 1977\nKhmer Rouge',(1965,26.5)),
    'China':('#30638E',(1962,44.5),'China 1962\nGreat Famine',(1953,32)),
    'Zimbabwe':('#8D6B94',(2002,40.0),'Zimbabwe 2002\n40 yrs (HIV/AIDS)',(1996,28.5)),
    'South Africa':('#00798C',(2002,53.4),'South Africa 2002\nHIV/AIDS',(1997,64))}
fig,ax=plt.subplots(figsize=(9.5,5.2))
for c,(col,pt,lab,tx) in cs.items():
    d=df[df.country==c]; ax.plot(d.year,d.lifeExp,color=col,lw=2.6)
    ax.scatter(*pt,s=90,color=col,zorder=5,edgecolor='white')
    ax.annotate(lab,xy=pt,xytext=tx,fontsize=8.5,color=col,fontweight='bold',arrowprops=dict(arrowstyle='-',color=col,lw=.8))
ax.set_ylabel('Life expectancy at birth (years)'); ax.set_xlim(1950,2009); ax.set_ylim(20,80); ax.grid(alpha=.25)
fig.tight_layout(); save(fig,'fig5_anomalies')

# FIG 6 preston shift
fig,ax=plt.subplots(figsize=(9,5))
xs=np.linspace(np.log10(300),np.log10(60000),100)
for y,c in zip([1952,1977,2007],['#B8C0D4','#7D8CC4','#30638E']):
    d=df[df.year==y]; b,a=np.polyfit(np.log10(d.gdpPercap),d.lifeExp,1)
    ax.scatter(d.gdpPercap,d.lifeExp,s=14,color=c,alpha=.35)
    ax.plot(10**xs,a+b*xs,color=c,lw=3,label=str(y))
ax.set_xscale('log'); ax.set_xticks(xt); ax.set_xticklabels([f'${x:,}' for x in xt]); ax.set_xlim(300,60000)
ax.set_xlabel('GDP per person (log scale, US$)'); ax.set_ylabel('Life expectancy at birth (years)'); ax.grid(alpha=.25); ax.legend(frameon=False,title='Trend line',loc='lower right')
for y,c,dy in [(1952,'#8F98B3',0),(2007,'#30638E',0)]:
    d=df[df.year==y]; b,a=np.polyfit(np.log10(d.gdpPercap),d.lifeExp,1)
ax.annotate('',xy=(1000,54.7),xytext=(1000,43.1),arrowprops=dict(arrowstyle='<->',color=INK,lw=1.5))
ax.text(1060,48,'+11.6 yrs:\nsame income,\nlonger life',fontsize=9,fontweight='bold',va='center',bbox=dict(fc='white',ec='none',alpha=.9,pad=2))
ax.annotate('',xy=(10000,71.3),xytext=(10000,63.5),arrowprops=dict(arrowstyle='<->',color=INK,lw=1.5))
ax.text(10700,67,'+7.8 yrs',fontsize=9,fontweight='bold',va='center',bbox=dict(fc='white',ec='none',alpha=.9,pad=2))
fig.tight_layout(); save(fig,'fig6_preston')

# FIG 7 residuals
d=df[df.year==2007].copy(); X=np.log10(d.gdpPercap); b,a=np.polyfit(X,d.lifeExp,1); d['res']=d.lifeExp-(a+b*X)
s=pd.concat([d.nsmallest(8,'res'),d.nlargest(8,'res')]).sort_values('res')
fig,ax=plt.subplots(figsize=(9,5.4))
ax.barh(s.country,s.res,color=[('#D1495B' if r<0 else '#00798C') for r in s.res])
for i,(r,le) in enumerate(zip(s.res,s.lifeExp)):
    ax.text(r+(-.5 if r<0 else .5),i,f'{r:+.0f} yrs',va='center',ha='right' if r<0 else 'left',fontsize=8.5,fontweight='bold')
ax.axvline(0,color=INK,lw=1); ax.set_xlabel('Life expectancy vs. what income alone predicts (years), 2007'); ax.set_xlim(-32,20); ax.grid(axis='x',alpha=.25)
ax.spines['left'].set_visible(False); ax.tick_params(axis='y',length=0)
fig.tight_layout(); save(fig,'fig7_residuals')
