Dlouhodobá programovací výzva - lodě
Cílem je vytvořit program, který bude hrát hru lodě s programem soupeře. Tyto programy budou komunikovat přes standardní vstup / výstup.

Termín odevzdání programů: 20. února 2022
Způsob odevzdání: bude specifikováno později
Použitá pravidla hry lodě

Hrací pole je velikosti 10 x 10. Řádky jsou označeny písmeny (A-J), sloupce jsou označeny čísly (1-10).
Do pole rozmisťujeme následující lodě:
1 letadlovou loď (1x5 políček)
1 bitevní loď (1x4 políčka)
2 křižníky (1x3 políčka)
2 torpédoborce (1x2 políčka)
1 ponorku (1x1 políčko)
Lodě se nesmí dotýkat boky, přídí, ani zádí.
Je dovolen kontakt pouze “přes roh” (viz obrázky).
Lodě jsou umístěné v hracím poli vertikálně nebo horizontálně, nikoli však diagonálně (viz obrázky).
Pozice lodi se po zahájení hry už nesmí měnit.
Začínající hráč se určí náhodně.
Ve svém tahu hráč vystřelí na pozici na hracím poli protihráče. Tuto pozici označí souřadnicemi (např. A3).
V případě zásahu některé lodi protihráče soupeř oznámí “hit” a hráč může střílet znovu (viz bod 8).
V případě minutí lodí protihráče soupeř oznámí “miss” a hráčův tah skončil.
Pokud je zasažena poslední část lodi a loď se potápí, protihráč oznámí “hit, sunk”.
Vítězí hráč, který dokáže dříve potopit všechny lodě protihráče.

Obrázek 1 - správné rozmístění

Obrázek 2 - špatné rozmístění


Pravidla komunikace programů
Programy by neměly na standardní výstup vypisovat nic nad rámec tohoto zadání. Můžete ale udělat “ukecaný” mód Vašeho programu, který bude uživatelsky přívětivý, pokud tento nebude výchozí po spuštění programu.

Zahájení hry
Jako první věc program na standardní výstup vypíše své herní pole. Pro moře použijte symbol `.` a pro část lodi symbol `X`. Výše ukázané hrací pole na obrázku 1 by tedy vypadalo takto:

………X
……X..X
.XXXX….X
…..XXX.X
………X
…..XX…
..X……X
..X……X
..X…….
……….



Na prvním řádku standardního vstupu obdržíte jedno číslo:
`1` - začíná váš program
`0` - začíná program soupeře
Tah
Hráč, který je aktuálně na tahu vypíše na standardní výstup pozici, na kterou chce vystřelit. Tyto budou ve formátu `B3`, kde B značí pořadí řádku (první řádek má index `A`) a 3 značí pořadí sloupce (první sloupec má index `1`). Pozice `A1` označuje levý horní roh herního plánu.
Následně na standardní vstup obdrží jednu ze tří zpráv:
`hit` - loď soupeře byla zasažena, máte další tah
`hit, sunk` - loď soupeře byla potopena, máte další tah
`hit, sunk, end` - loď soupeře byla potopena, soupeř má potopeny všechny lodě a prohrál
`miss` - nezasáhli jste, hraje soupeř

Hráč, který aktuálně na tahu není obdrží na standardním vstupu pozici a na standardní výstup vypíše výsledek střely dle specifikace výše.
Konec hry
Konec hry nastane po oznámení `hit, sunk, end` jedním ze hráčů.
Poznámky
Všechny příkazy (výstřely, odpovědi) budou na samostatných řádcích.
Pokud soupeř vystřelí na pozici, na kterou již jednou střílel (ať už bylo pole původně prázdné či plné), vrátíte výsledek `miss`.
Technická specifika programů
Program musí jít spustit z příkazové řádky na operačním systému Windows 10. Povolené programovací jazyky jsou: Python 3, C#, Java, C/C++, JavaScript (Node.JS).

V případě zájmu o povolení dalšího programovacího jazyka kontaktujte V. Švandelíka.
Vyhodnocení programů
Po konci období na tvorbu programů nastane vyhodnocení - turnaj. V tomto turnaji budou spuštěny všechny programy proti sobě a bude se zaznamenávat počet výher (1 body) a počet proher (0 bodů). Zároveň se bude zaznamenávat počet výstřelů každého z hráčů. 

Turnaj vyhraje ten hráč, který bude mít nejvíce bodů. V případě remízy ten z hráčů, které využil během celého turnaje méně výstřelů.

V případě, že program spadne či se bude chovat nestandardně, souboj automaticky vyhrál protivník.

Do turnaje může každý z účastníků přihlásit až 3 soutěžní programy.


src: https://docs.google.com/document/d/1sVvF50JKndc4Fq7_36WNSMSqcuud6ojDs1I24XQ2EQY/edit#
