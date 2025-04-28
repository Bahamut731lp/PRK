# Jak rozchodit toto cvičení

1. Aktivuj venv tohoto repozitáře přes `source env/bin/activate` (Linux) nebo `call env/Scripts/activate.bat` (Windows).
2. Nainstaluj závislosti pomocí `pip install -r requirements.txt`
3. (Optional) Pokud neexistují, vygeneruj parser files přes `antlr4 -Dlanguage=Python3 -visitor in_silico.g4`.
4. Spusť program přes `python main.py`