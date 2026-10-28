const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,ImageRun,HeadingLevel,AlignmentType,LevelFormat,Table,TableRow,TableCell,WidthType,BorderStyle,ShadingType,Footer,Header,PageNumber,PageBreak}=require('docx');
const imgSize=(f)=>{const b=fs.readFileSync(f);return {w:b.readUInt32BE(16),h:b.readUInt32BE(20)};};
const INK='2B2D42',BLUE='30638E',RED='D1495B',GREY='6B7280',FONT='Calibri';
const P=(t,o={})=>new Paragraph({spacing:{after:140,line:290},alignment:o.align||AlignmentType.LEFT,...o.p,children:Array.isArray(t)?t:[new TextRun({text:t,font:FONT,size:22,...o.r})]});
const R=(t,o={})=>new TextRun({text:t,font:FONT,size:22,...o});
const B=(t)=>R(t,{bold:true});
const H1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:160},children:[new TextRun({text:t,font:FONT})]});
const H2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:280,after:120},keepNext:true,children:[new TextRun({text:t,font:FONT})]});
const H3=t=>new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:160,after:80},keepNext:true,children:[new TextRun({text:t,font:FONT})]});
const bullet=(parts)=>new Paragraph({numbering:{reference:'bul',level:0},spacing:{after:80,line:280},children:Array.isArray(parts)?parts:[R(parts)]});
const lab=(label,text)=>P([B(label+' '),R(text)]);
const callout=(title,text)=>new Paragraph({spacing:{before:120,after:200,line:290},indent:{left:200,right:100},
  border:{left:{style:BorderStyle.SINGLE,size:24,color:BLUE,space:10}},shading:{type:ShadingType.CLEAR,fill:'EEF3F8'},
  children:[new TextRun({text:title+' ',bold:true,font:FONT,size:22,color:BLUE}),R(text)]});
function fig(file,n,caption,wIn=6.4){
  const s=imgSize(file); const w=Math.round(wIn*96), h=Math.round(w*s.h/s.w);
  return [new Paragraph({alignment:AlignmentType.CENTER,keepNext:true,spacing:{before:120,after:60},children:[new ImageRun({type:'png',data:fs.readFileSync(file),transformation:{width:w,height:h},altText:{title:`Figure ${n}`,description:caption,name:`fig${n}`}})]}),
   new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`Figure ${n}. `,bold:true,italics:true,font:FONT,size:19,color:GREY}),new TextRun({text:caption,italics:true,font:FONT,size:19,color:GREY})]})];
}
const bd={style:BorderStyle.SINGLE,size:4,color:'C9CED6'}; const borders={top:bd,bottom:bd,left:bd,right:bd};
function table(widths,rows,headFill=BLUE){
  const total=widths.reduce((a,b)=>a+b,0);
  return new Table({width:{size:total,type:WidthType.DXA},columnWidths:widths,rows:rows.map((r,i)=>new TableRow({tableHeader:i===0,cantSplit:true,children:r.map((c,j)=>new TableCell({borders,width:{size:widths[j],type:WidthType.DXA},
    shading:{type:ShadingType.CLEAR,fill:i===0?headFill:(i%2?'FFFFFF':'F4F6F9')},margins:{top:70,bottom:70,left:110,right:110},
    children:[new Paragraph({children:[new TextRun({text:c,font:FONT,size:20,bold:i===0,color:i===0?'FFFFFF':INK})]})]}))}))});
}
const F=(n)=>`figures/${n}.png`;
const c=[];
// ---------- Title page
c.push(new Paragraph({spacing:{before:2200,after:120},children:[new TextRun({text:'WEEK 2 PROJECT  |  ADVANCED DATA VISUALIZATION & STORYTELLING',font:FONT,size:20,bold:true,color:GREY,characterSpacing:40})]}));
c.push(new Paragraph({spacing:{after:160},children:[new TextRun({text:'Richer, Healthier, but Not Equally',font:FONT,size:68,bold:true,color:INK})]}));
c.push(new Paragraph({spacing:{after:480},border:{bottom:{style:BorderStyle.SINGLE,size:18,color:RED,space:12}},children:[new TextRun({text:'Seven visualizations of how wealth and life expectancy moved together across 142 countries, 1952–2007',font:FONT,size:30,color:BLUE})]}));
c.push(P([B('Dataset: '),R('Gapminder (country-level life expectancy, GDP per person and population)')]));
c.push(P([B('Tools: '),R('Python, pandas, NumPy, Matplotlib, Seaborn')]));
c.push(P([B('Audience: '),R('Non-technical readers: managers, policy makers and students')]));
c.push(new Paragraph({children:[new PageBreak()]}));
// ---------- Contents / roadmap
c.push(H1('Document Roadmap'));
c.push(table([900,4700,3760],[['Section','Title','What it covers'],
 ['1','Introduction','The question, the audience, the headline finding'],
 ['2','Data and Methods','Dataset, cleaning, calculations, design principles'],
 ['3','Visual Analyses (Figures 1–7)','The seven-chart data story, each with reasoning'],
 ['4','Implications','Business, policy and scientific takeaways'],
 ['5','Limitations and Next Steps','What the data cannot tell us'],
 ['6','Conclusion','The story in one paragraph'],
 ['A','Appendix','Key statistics table and reproducibility notes']]));
c.push(P(''));
c.push(H2('The story in one sentence'));
c.push(P('In 55 years the average person on Earth gained about 20 extra years of life, and richer countries still live longer, but income explains only part of the story: the biggest surprises come from countries that beat or badly miss what their wealth predicts.'));
c.push(new Paragraph({children:[new PageBreak()]}));
// ---------- 1 Intro
c.push(H1('1. Introduction'));
c.push(P('Numbers on their own rarely persuade anyone. A table with 1,704 rows of country statistics is accurate, but a manager, a student or a minister cannot see anything in it. This project turns that kind of table into a short visual argument that anyone can follow without a statistics background.'));
c.push(P('I chose global health and wealth because it is a topic with a clear human meaning (how long people live), a clear economic meaning (how much a country produces per person), and a long enough time span (1952–2007) to show real change. It also contains the three ingredients of a good data story: a big trend, a set of surprises, and an open question.'));
c.push(H2('The questions the document answers'));
c.push(bullet([B('How much has the world changed? '),R('Did people really live longer in 2007 than in 1952, and by how much?')]));
c.push(bullet([B('Where did the change happen? '),R('Did all regions improve at the same speed?')]));
c.push(bullet([B('Is wealth the whole explanation? '),R('Do richer countries always live longer, and has that relationship moved over time?')]));
c.push(bullet([B('What went wrong, and where? '),R('Which events or countries broke the upward trend?')]));
c.push(H2('Headline findings'));
c.push(bullet('Population-weighted life expectancy rose from 48.9 to 68.9 years (+20.0), and the number of countries with life expectancy below 50 fell from 82 to 19.'));
c.push(bullet('Asia gained the most (about 26 years); Africa gained about 16 years but stalled between 1992 and 2002, and still trailed Europe by 23 years in 2007.'));
c.push(bullet('At the same income, people in 2007 lived 8 to 12 years longer than in 1952. Health improved even where money did not.'));
c.push(bullet('Income gaps between countries more than doubled in relative terms (top-to-bottom 10% ratio 14.7× to 37.9×), yet the life-expectancy spread stayed almost unchanged (31.4 vs 31.6 years).'));
c.push(bullet('Conflict, famine and HIV/AIDS produced the sharpest reversals, and several southern African countries in 2007 lived 20+ years shorter than their income predicts.'));
// ---------- 2 Methods
c.push(H1('2. Data and Methods'));
c.push(H2('2.1 Dataset'));
c.push(P('The data come from the Gapminder project, which compiles country statistics from public sources. I loaded the copy distributed with the Plotly Express Python package (px.data.gapminder()), so the analysis is fully reproducible with a single line of code. The data set contains one row per country per five-year period:'));
c.push(table([2300,7060],[['Variable','Meaning'],
 ['country, continent','142 countries grouped into Africa, Americas, Asia, Europe and Oceania'],
 ['year','12 snapshots: 1952, 1957, … 2007 (every five years)'],
 ['lifeExp','Life expectancy at birth, in years'],
 ['gdpPercap','Economic output per person, adjusted for price differences between countries'],
 ['pop','Population of the country']]));
c.push(P(''));
c.push(H2('2.2 Preparation and calculations'));
c.push(bullet([B('Data quality. '),R('The data have no missing values (1,704 rows, 142 countries × 12 years), so no rows were dropped or imputed.')]));
c.push(bullet([B('Population weighting. '),R('Regional averages are weighted by population. A simple average treats tiny Oceania the same as China; weighting reflects what the average person actually experiences. Country-level distributions (Figures 2, 6, 7) are unweighted because there the country is the unit of interest.')]));
c.push(bullet([B('Log scale for income. '),R('Income spans from about $240 to $49,000 per person. On a straight axis, most countries would be squashed into a corner. A logarithmic axis gives each doubling of income the same width, which matches how the effect of money on health works (diminishing returns).')]));
c.push(bullet([B('Trend lines. '),R('For Figures 6 and 7 I fitted a straight line of life expectancy against the logarithm of income for each year, by least squares. The distance of a country from that line (its residual) shows whether it beats or misses what its income predicts.')]));
c.push(bullet([B('Change detection. '),R('Five-year changes were computed per country to find reversals; 102 of 1,562 country-periods (6.5%) show a decline.')]));
c.push(H2('2.3 Design principles for a non-technical audience'));
c.push(bullet([B('One message per chart. '),R('Each figure has a single headline and a title or annotation that states it in plain words.')]));
c.push(bullet([B('Consistent colour. '),R('A continent keeps the same colour in every figure (red Africa, gold Asia, teal Americas, blue Europe, purple Oceania), so readers learn the code once.')]));
c.push(bullet([B('Direct labels instead of legends '),R('wherever possible, so the eye does not have to travel back and forth.')]));
c.push(bullet([B('Annotations carry the story. '),R('Callouts mark events (Rwanda 1992, China 1962) so the chart explains itself.')]));
c.push(bullet([B('Chart type follows the question: '),R('comparison across two moments (paired panels, split violins), change over time (lines, heatmap), relationship (scatter and trend), ranking (bar chart).')]));
c.push(P('I tested several alternatives before settling on the final set. A pie chart of regional population, a 3D surface and a single animated bubble chart were rejected because they were either hard to read in print or hid the comparison I wanted to make. A choropleth world map was also considered, but a map shows geography, not the relationship between wealth and health, so it would have added decoration rather than insight.'));
c.push(new Paragraph({children:[new PageBreak()]}));
// ---------- 3 Visuals
c.push(H1('3. Visual Analyses'));
c.push(P('The seven figures are ordered as a narrative: set the scene (Figures 1–2), show the regional paths (3–4), examine the shocks (5), then explain what wealth can and cannot do (6–7). Each is followed by the reasoning for the chart choice and how it moves the story forward.'));
// Fig1
c.push(H2('Act 1: The World Changed'));
c.push(H3('Figure 1. The world in 1952 and in 2007'));
c.push(...fig(F('fig1_bubble'),1,'Each bubble is a country. Position shows income (horizontal, log scale) and life expectancy (vertical); size shows population; colour shows continent. The dashed line marks the median country.',6.5));
c.push(lab('What it shows.','In 1952 most countries cluster in the lower left: low income and short lives. The median country had a life expectancy of 45 years. By 2007 the whole cloud has moved up and to the right, and the median country lives 72 years. Africa (red) has moved much less than Asia (gold).'));
c.push(lab('Why this chart.','A bubble chart can show four variables at once (income, health, population and region) while keeping every country visible. Two side-by-side panels with the same axes let the reader compare “then” and “now” directly. Placing them next to each other is easier to read than an animation, which cannot be printed or compared frame to frame.'));
c.push(lab('How it advances the story.','It establishes the main plot: the world got healthier and richer, the two moved together, and the picture is not the same for every region. It also introduces China and India, the two giant gold bubbles that drive the world average, and Nigeria and the United States as reference points.'));
c.push(callout('Insight.','Median life expectancy jumped from 45 to 72 years and the number of countries below 50 fell from 82 to 19. India (37 → 65 years) and China (44 → 73) gained 27 and 29 years respectively.'));
// Fig2
c.push(H3('Figure 2. How much did each region improve, and how spread out are countries?'));
c.push(...fig(F('fig2_violin'),2,'Distribution of country life expectancy by continent in 1952 (grey) and 2007 (blue). Each half-violin shows how countries are spread; inner lines mark quartiles. Oceania (only Australia and New Zealand) is omitted.',6.2));
c.push(lab('What it shows.','The median Asian country gained about 27 years, the median American country 18 years, the median African country 14 years and the median European country 13 years. Europe started high and had less room to climb. African countries remain widely spread (long tail below 45 years), while Europe in 2007 is tightly packed between 72 and 82 years.'));
c.push(lab('Why this chart.','An average hides spread. A violin plot shows the entire shape of each group, so the reader sees whether a region is uniform or divided. Splitting each violin into two halves puts 1952 and 2007 side by side for each continent, which makes the improvement visible as a shift and not as a table of numbers.'));
c.push(lab('How it advances the story.','Figure 1 showed the world moving. Figure 2 asks “who moved?” and shows that the answer depends on the region. It also reveals that inequality inside Africa and Asia is greater than inside Europe.'));
c.push(callout('Insight.','Asia compressed most of its gap with the West in half a century; Africa improved but kept a long tail of countries with very low life expectancy.'));
// Fig3
c.push(H2('Act 2: Different Regions, Different Paths'));
c.push(H3('Figure 3. Life expectancy by continent, 1952–2007'));
c.push(...fig(F('fig3_lines'),3,'Population-weighted life expectancy for each continent, with direct labels and callouts. Asia’s steep rise and Africa’s flat period after 1992 are annotated.',6.3));
c.push(lab('What it shows.','Every region improved, but not equally. Asia climbed from 43 to 69 years and closed much of the distance to the Americas and Europe. Africa rose steadily until 1992 (53.4 years), then stayed at 53.3 years for a decade before recovering to 54.6 in 2007. The gap between Europe and Africa fell only from 26.1 years in 1952 to 23.3 in 2007.'));
c.push(lab('Why this chart.','A line chart is the natural choice for change over time: slope equals speed, and crossings or flat spots stand out immediately. Labels at the end of each line replace a legend, and only two annotations are added so the chart stays uncluttered.'));
c.push(lab('How it advances the story.','It moves from a snapshot (Figures 1–2) to a trajectory. The plateau in Africa is the first sign that progress is not automatic, which prepares the reader for the anomalies in Figure 5.'));
c.push(callout('Insight.','Convergence happened in Asia, not in Africa. Africa’s progress stood still for a decade (1992–2002).'));
// Fig4
c.push(H3('Figure 4. Where and when progress sped up or stopped'));
c.push(...fig(F('fig4_heatmap'),4,'Years of life expectancy gained in each five-year period, by continent (population-weighted). Blue = large gains, red/white = stagnation or loss.',6.5));
c.push(lab('What it shows.','The darkest blue cell is Asia in 1962–67 (+7.3 years), the period following China’s recovery from the famine. The lightest cells are Asia in 1957–62 (−0.7 years) and Africa in 1992–97 and 1997–02 (−0.1 and 0.0 years). Europe, the Americas and Oceania show a steady, slowing climb of one to two years per period.'));
c.push(lab('Why this chart.','Figure 3 shows levels; this heatmap shows speed. A grid of colours is better than 55 data points on a line chart because it lets the reader scan by row (one region over time) or by column (all regions in one period). Diverging colours centred on a typical gain draw attention to the exceptions.'));
c.push(lab('How it advances the story.','It isolates exactly when each region’s trend broke. The two white-ish stretches (Asia 1957–62, Africa 1992–2002) point toward the specific events investigated in the next figure.'));
c.push(callout('Insight.','Rich regions gain a little every period; poorer regions gain in bursts and can also lose ground.'));
// Fig5
c.push(H2('Act 3: When Progress Reversed'));
c.push(H3('Figure 5. Five stories of collapse and recovery'));
c.push(...fig(F('fig5_anomalies'),5,'Life expectancy in five countries that experienced sharp reversals, with the worst data point and its cause annotated.',6.5));
c.push(lab('What it shows.','Rwanda’s life expectancy fell from 44.0 to 23.6 years in 1992, a drop of 20.4 years in a single five-year period and the largest in the dataset. Cambodia fell to 31.2 years in 1977 during the Khmer Rouge period. China dipped by about 6 years in 1962, the Great Famine. Zimbabwe fell by 13.6 years in 1997, and by 2002 stood at 40 years; South Africa lost about 12.5 years between 1992 and 2007 (61.9 to 49.3). The dips associated with AIDS lasted longer than those of war or famine.'));
c.push(lab('Why this chart.','Aggregates hide shocks, so I zoomed in on specific countries. Five lines is the maximum a reader can follow; each is colour-coded and labelled at the exact point of failure, so the chart reads like a timeline of events. The annotation of the cause (genocide, famine, HIV/AIDS) is placed on the chart because it turns an abstract dip into a human story.'));
c.push(lab('How it advances the story.','This is the emotional centre of the narrative. It shows what lies behind the flat African line in Figure 3 and the pale cell for Asia in Figure 4, and it demonstrates that gains in life expectancy are fragile. It also sets up the question: if wealth does not protect against these shocks, what role does it play?'));
c.push(callout('Insight.','Reversals are rare (6.5% of country-periods) but severe. Wars, famines and a health epidemic erased decades of progress within a few years. China and Cambodia recovered within a decade; the HIV/AIDS countries took much longer.'));
// Fig6
c.push(H2('Act 4: What Wealth Can and Cannot Explain'));
c.push(H3('Figure 6. The wealth–health curve has shifted upward'));
c.push(...fig(F('fig6_preston'),6,'Life expectancy against income per person for all countries in 1952, 1977 and 2007, with a trend line for each year. Arrows show how much longer people lived at the same income.',6.3));
c.push(lab('What it shows.','In every year richer countries live longer, and the link strengthened over time (correlation 0.75 in 1952, 0.81 in 2007). But the trend line itself has moved up. A person in a country with $1,000 per person could expect about 43 years in 1952 and about 55 years in 2007: 11.6 additional years at no extra income. At $10,000 the improvement was 7.8 years. Each tenfold increase in income was associated with roughly 17 more years of life in 2007.'));
c.push(lab('Why this chart.','Scatter plots with trend lines are the clearest way to show a relationship. Three years are overlaid, with progressively darker colour for later years, so the shift is visible as a vertical gap. The arrows translate the gap into plain language. The log axis straightens a curved relationship so the lines can be compared at a glance.'));
c.push(lab('How it advances the story.','It answers the central question. Wealth matters, but it is not the only driver: vaccines, clean water, antibiotics and public-health knowledge improved life expectancy at every income level. This is why the world got healthier faster than it got richer.'));
c.push(callout('Insight.','Technology and public health, not only economic growth, lifted life expectancy: the same income buys more years of life today than in 1952.'));
// Fig7
c.push(H3('Figure 7. Who beats, and who misses, what their income predicts?'));
c.push(...fig(F('fig7_residuals'),7,'Difference between actual 2007 life expectancy and the value predicted from income alone: the eight best and eight worst performers among 142 countries.',6.2));
c.push(lab('What it shows.','Vietnam lives 13 years longer than its income predicts, followed by Nicaragua, the West Bank and Gaza and the Comoros (about 11 years each). At the other end, eight countries live 14 to 26 years less than predicted. Swaziland is 26 years below its prediction, followed by Angola, Botswana, South Africa and Equatorial Guinea. Several of these are fairly rich in income per person (Botswana $12,570, Equatorial Guinea $12,154) but have very short lives.'));
c.push(lab('Why this chart.','A diverging horizontal bar chart is ideal for ranking positive and negative gaps. Colour separates over-achievers (teal) from under-achievers (red), the zero line is the benchmark and the bar length can be compared by eye. Only the extremes are shown, as 142 bars would be unreadable.'));
c.push(lab('How it advances the story.','This closes the loop. Figure 6 showed the average relationship; Figure 7 shows the countries that depart from it. The red group overlaps strongly with the HIV/AIDS-affected countries in Figure 5 (Angola’s shortfall also reflects a long civil war), and the teal group suggests that public-health choices may deliver long lives at modest incomes.'));
c.push(callout('Insight.','Income is a poor predictor for countries hit by HIV/AIDS or where wealth comes from a narrow source such as oil or diamonds. Countries such as Vietnam show that good health outcomes are possible without high income.'));
c.push(new Paragraph({children:[new PageBreak()]}));
// ---------- 4 Implications
c.push(H1('4. Implications'));
c.push(H2('4.1 Business implications'));
c.push(bullet([B('Growth markets are health markets. '),R('Asian life expectancy rose by 26 years in half a century, and several large populations (India, Indonesia, Vietnam) are still climbing. Longer lives create demand for healthcare, insurance, pensions, nutrition and ageing-related services. Companies can use these curves to time market entry by country.')]));
c.push(bullet([B('Income alone is a weak segmentation variable. '),R('Figure 7 shows countries with similar income but a 40-year difference in life expectancy. A firm selling health products or insurance should layer health indicators on top of GDP per person.')]));
c.push(bullet([B('Risk planning. '),R('Because reversals are rare but severe, businesses with workforce exposure in high-risk regions need a plan for epidemics, conflict and supply shocks. Rwanda, Zimbabwe and South Africa show how quickly a labour force can be affected.')]));
c.push(bullet([B('Inequality is a long-term market-size issue. '),R('The relative income gap between the top and bottom 10% of countries grew from 14.7× to 37.9×, which means the upper segment grows faster than the lower segment. Products priced for rich markets will not reach most of the world’s people without adaptation.')]));
c.push(H2('4.2 Policy and scientific implications'));
c.push(bullet([B('Target health directly. '),R('Figure 6 suggests that public-health programmes (vaccination, sanitation, maternal care) deliver longer lives without waiting for economic growth. Vietnam and Nicaragua are natural case studies for research.')]));
c.push(bullet([B('Treat epidemics as development setbacks. '),R('The HIV/AIDS countries are the largest negative outliers. Investment in prevention and treatment protects the economic returns of every other development programme.')]));
c.push(bullet([B('Research agenda. '),R('Scientists could investigate why some low-income countries over-perform, which factors (education, female literacy, health systems, equality) explain the gap, and whether the pattern is causal. The data here show association, not causation.')]));
c.push(bullet([B('Monitoring. '),R('Dashboards that track five-year change (Figure 4) would flag stagnation early, long before an average looks alarming.')]));
// ---------- 5 Limitations
c.push(H1('5. Limitations and Next Steps'));
c.push(bullet([B('Correlation is not causation. '),R('Figures 6–7 show how income and life expectancy move together, not that money alone causes longer life, nor that health causes wealth. Both effects are likely.')]));
c.push(bullet([B('Time span ends in 2007. '),R('The dataset predates the 2008 financial crisis, the 2010s and COVID-19. The analysis should be refreshed with recent data before it informs current decisions.')]));
c.push(bullet([B('Five-year snapshots. '),R('Short events (a single year of famine) are blurred, so the dips shown are conservative.')]));
c.push(bullet([B('Averages hide inequality inside countries. '),R('Life expectancy and income are national averages; they say nothing about differences between rich and poor citizens, or between men and women.')]));
c.push(bullet([B('Linear model. '),R('A straight line on a log scale fits reasonably (R² = 0.65 in 2007), but a more flexible model could capture flattening at high income.')]));
c.push(P([B('Next steps: '),R('merge the data with education and health spending, extend to 2023, add uncertainty bands to the trend lines, and build an interactive Plotly dashboard so readers can choose their own countries.')]));
// ---------- 6 Conclusion
c.push(H1('6. Conclusion'));
c.push(P('Between 1952 and 2007 the typical person gained about two decades of life, a change without parallel in human history. The seven visualizations tell the story in a logical order: the world moved (Figure 1), but regions moved differently (Figures 2–4); shocks of war, famine and disease broke the pattern in specific places (Figure 5); and wealth explains a large part of the change but not all of it, since the same income now buys more years of life (Figure 6) and some countries deviate by decades from what income predicts (Figure 7).'));
c.push(P('The most important lesson for a non-technical reader is that progress is real, but neither automatic nor equal. Clear charts make that visible, and they show decision makers where to look: the countries that stalled, the countries that overperformed, and the policies that explain the difference.'));
// ---------- Appendix
c.push(new Paragraph({children:[new PageBreak()]}));
c.push(H1('Appendix A. Key Statistics'));
c.push(table([3400,2000,2000,1960],[['Measure','1952','2007','Change'],
 ['Population-weighted life expectancy (years)','48.9','68.9','+20.0'],
 ['Median country life expectancy (years)','45.1','71.9','+26.8'],
 ['Countries with life expectancy below 50','82','19','−63'],
 ['Countries with life expectancy below 60','107','43','−64'],
 ['Median GDP per person (US$)','1,969','6,124','×3.1'],
 ['Correlation: life expectancy vs. log income','0.75','0.81','+0.06'],
 ['Predicted life expectancy at $1,000 (years)','43.1','54.7','+11.6'],
 ['Predicted life expectancy at $10,000 (years)','63.5','71.3','+7.8'],
 ['Life-expectancy spread, top vs. bottom 10% (years)','31.4','31.6','+0.2'],
 ['Income ratio, top vs. bottom 10% of countries','14.7×','37.9×','×2.6']]));
c.push(P(''));
c.push(H1('Appendix B. Population-Weighted Life Expectancy by Continent'));
c.push(table([2400,1900,1900,1700,1460],[['Continent','1952','2007','Gain','Countries'],
 ['Africa','38.8','54.6','+15.8','52'],['Asia','42.9','69.4','+26.5','33'],['Americas','60.2','75.4','+15.1','25'],
 ['Europe','64.9','77.9','+13.0','30'],['Oceania','69.2','81.1','+11.9','2']]));
c.push(P(''));
c.push(new Paragraph({children:[new PageBreak()]}));
c.push(H1('Appendix C. Reproducibility'));
c.push(P('All figures were generated in Python with a single script. The data are loaded with plotly.express.data.gapminder(); charts are drawn with Matplotlib and Seaborn; the trend lines use NumPy’s polyfit on log10(income). The core steps are:'));
const code=['df = px.data.gapminder()','cw = df.groupby(["continent","year"]).apply(lambda g: np.average(g.lifeExp, weights=g["pop"]))','b, a = np.polyfit(np.log10(d.gdpPercap), d.lifeExp, 1)     # trend per year','d["residual"] = d.lifeExp - (a + b*np.log10(d.gdpPercap))   # Figure 7','df["change"] = df.groupby("country").lifeExp.diff()           # Figures 4-5'];
code.forEach(l=>c.push(new Paragraph({spacing:{after:20},shading:{type:ShadingType.CLEAR,fill:'F4F6F9'},indent:{left:200},children:[new TextRun({text:l,font:'Consolas',size:18})]})));
c.push(P(''));
c.push(P([B('Data source: '),R('Gapminder Foundation, via the Plotly Express sample data. Figures are generated from the data and annotated by hand to reflect well-documented historical events (Rwandan genocide 1994, Khmer Rouge period 1975–79, China’s Great Famine 1959–61, the HIV/AIDS epidemic in southern Africa from the 1990s).')],{}));

const doc=new Document({
 creator:'Week 2 Project',title:'Richer, Healthier, but Not Equally',
 styles:{default:{document:{run:{font:FONT,size:22,color:INK}}},
  paragraphStyles:[
   {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:34,bold:true,color:INK,font:FONT},paragraph:{spacing:{before:360,after:160},outlineLevel:0,keepNext:true}},
   {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:28,bold:true,color:BLUE,font:FONT},paragraph:{spacing:{before:280,after:120},outlineLevel:1}},
   {id:'Heading3',name:'Heading 3',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:24,bold:true,color:INK,font:FONT},paragraph:{spacing:{before:200,after:100},outlineLevel:2}}]},
 numbering:{config:[{reference:'bul',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]}]},
 sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1300,right:1440,bottom:1200,left:1440}}},
  headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:'Richer, Healthier, but Not Equally',font:FONT,size:18,color:GREY})]})]})},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'Page ',font:FONT,size:18,color:GREY}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:18,color:GREY})]})]})},
  children:c}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('report/Week2_Data_Visualization_Storytelling.docx',b);console.log('written')});
