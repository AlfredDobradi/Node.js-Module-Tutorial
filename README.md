Bevezetés
==

Ha huzamosabb ideje használod a Node.js-t, vagy van tapasztalatod JavaScript AMD modulokkal, biztos eszedbe jutott már, hogy saját modult írj, specifikus, de sokszor használt feladatok elvégzésére. Ez a kis leírás remélhetőleg segíteni fog ebben, de ha bármi kérdésed van, szívesen válaszolok.

Modulok betöltése
==

Először ejtenék pár szót arról, hogyan töltődnek be a modulok. Ha már van tapasztalatod a Node.js modulkezelőjével, ez ismerős lehet. A modulok betöltésére a require() függvényt kell meghívni, a modul nevével paraméterezve. Tegyük fel, ha a http modult szeretnénk használni, a következő sorral tehetjük meg:

  var http = require(“http”);

Ha esetleg nem szeretnénk az egész modult használni, csak egy adott objektumát, ezt is megtehetjük:

	var spawn = require(“child_process”).spawn;

Többféle modul létezik. A fenti két példában szereplő http és child_process modulok ún. core modulok, melyek a Node.js részei. Ezen kívül betölthetünk modulokat a node_modules könyvtárból, illetve egy különálló .js fájlból is.
Ha a require() függvénynek egy útvonalat adunk meg, ez esetben a modult az adott helyen fogja keresni a Node, ha csak egy string-et, akkor a node_modules könyvtárban néz utána.

Saját modulok készítése
==

A peldaban egy nem annyira hasznos modult készítünk, amelyet naplózásra fogunk használni. Két lépcsőben készítjük el a modult, az első lépésben csak fájlba naplózunk és egy darab .js, majd később egy .node fájl lesz a modulunk, majd később könyvtárba rendezzük és megírjuk hozzá a package.json fájlt.

Első lépés, fájlba írás
--

A modulunk első lépésben két publikus függvényt fog tartalmazni. Az egyik visszaadja az utolsó naplózott üzenetet, míg a másik fájlbamenti a paraméterként kapott bejegyzést. Paraméterként egy üzenetet és egy opcionális naplózási szintet várunk.
 
Létrehozzuk a logger.js fájlt a projektünk gyökerében, majd a behívjuk az fs core modult, ami a fájlrendszeri műveletekért felelős, beállítjuk a fájlnevet, az utolsó üzenetet tartalmazó objektumot, majd létrehozzuk a két függvényt.

	var fs = require(‘fs’);

	var filename = 'tutorial.log';
	var last_message = {
		date: null,
		msg: null,
		level: 'debug'
	};

	var log_message = function(msg, level) {
		if ( ! level ) { level = ‘debug’; }

	var log_message = function(message, level) {
		if ( null == level ) { level = 'debug'; }
		last_message = {
			date: new Date().toDateString(),
			msg: message,
			level: level
		};
		
		var log = '[ ' + last_message.date + ' ] [ ' + last_message.level + ' ] ' + last_message.msg;

		fs.appendFile(filename,log + “\n”,function(err) {
			if ( err ) { throw err; }
			else {
				console.log(log);
			}
		});
	};

	var get_last_message = function() {
		return last_message;
	};

Az első függvény működése nem túl bonyolult, kap egy üzenetet és egy naplózási szintet, majd azt megpróbálja hozzáfűzni a megadott fájlhoz. Ha sikerült, a Node konzoljába is kiírjuk a mentett sort, ha nem, dobunk egy hibát.

A második függvénynek úgy tűnhet nincs haszna, de ez korán sincs így. A Node.js modulokban minden ki nem exportált objektum privát, kívülről nem elérhető. Ha valamely változó értékét mégis tudni szeretnénk, ún. getter függvényekre kell hagyatkoznunk.	

Ahhoz, hogy a fent deklarált függvényeket használni tudjuk, mint az előző bekezdésben írtam, exportálni kell. Ezt a következőképpen tehetjük meg:

module.exports = {
	log_message: log_message,
	get_last_message: get_last_message
};

Ha elmentettük a fájlt, jöhet a próba. Készítsünk egy app.js fájlt ugyanebbe a könyvtárba, és írjuk bele:

var logger = require(‘./logger.js’);
for(var i = 0; i<10; i++) {
	logger.log_message(‘i = ‘+i);
}

Majd futtassuk le a node app.js paranccsal, és nézzük mi történik. Remélhetőleg a képernyőn csaknem azonnal megjelenik az elvárt eredmény, miszerint a ciklus minden alkalommal kiiratta az i aktuális értékét. Ha ez így van, nézzük meg a fájlt, amiben ugyanezt kell látnunk.

Ha az utolsó naplóbejegyzést szeretnénk visszakapni, ebben az esetben a logger.get_last_message() függvényt kell használnunk.
