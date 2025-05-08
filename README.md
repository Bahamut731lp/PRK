# Jak spustit cvičení

1. Aktivujte venv tohoto repozitáře přes `source env/bin/activate` (Linux) nebo `call env/Scripts/activate.bat` (Windows).
2. Nainstalujte závislosti pomocí `pip install -r requirements.txt`
3. (Optional) Pokud neexistují, vygeneruj parser files přes `antlr4 -Dlanguage=Python3 -visitor in_silico.g4`.
4. Spusťte program přes `python main.py <nazev_souboru>`.

## Vzorky pro testování
Pro testovací účely je zde v kořenovém adresáři soubor `test.py`, který používá knihovnu [pytest](https://docs.pytest.org/en/stable/) pro testování jednotlivých zdrojových kódů. Adresář `src_tests` obsahuje celkem 6 souborů - první 3 jsou správné, další 3 obsahují špatnou syntaxi.

Testy lze spustit následovně:
1. Pokud ještě nemáte, aktivujte venv tohoto repozitáře přes `source env/bin/activate` (Linux) nebo `call env/Scripts/activate.bat` (Windows).
2. Spusťte testy přes `pytest test.py`.