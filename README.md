# Richer, Healthier, but Not Equally
Week 2: Advanced Data Visualization and Storytelling with Python.

Seven visualizations of how income and life expectancy changed across 142 countries (1952-2007), using the Gapminder dataset.

## Contents
- `src/analysis.py` : exploratory statistics used in the narrative
- `src/figs.py` : generates the 7 figures (Matplotlib + Seaborn) into `figures/`
- `src/build.js` : assembles the Word report (Node, `docx` package)
- `report/Week2_Data_Visualization_Storytelling.docx` : final submission

## Run it
```bash
pip install -r requirements.txt
python src/analysis.py        # prints key statistics
python src/figs.py            # creates figures/*.png
npm install
npm run report                # builds report/*.docx
```

## Figures
1. Bubble charts 1952 vs 2007
2. Split violins by continent
3. Life expectancy by continent over time
4. Heatmap of 5-year gains
5. Annotated collapses (Rwanda, Cambodia, China, Zimbabwe, South Africa)
6. Wealth-health curve shifts
7. Over/under-performers vs income-predicted life expectancy

Data: Gapminder, via `plotly.express.data.gapminder()`.
