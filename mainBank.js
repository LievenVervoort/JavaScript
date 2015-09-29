var vandaag = new Date();

/*************** Cookies ****************/

function setCookie(naam, waarde, dagen) {
    var verval = "";

    if (dagen) {
        var vervalDatum = new Date(vandaag.getTime() + dagen * 24 * 60 * 60 * 1000);
        verval = vervalDatum.toUTCString();
    }
    document.cookie = naam + "=" + waarde + ";expires=" + verval;
}

function getCookie(naam) {
    var zoek = naam + "=";

    if (document.cookie.length > 0) {
        var begin = document.cookie.indexOf(zoek);
        if (begin != -1) {
            begin += zoek.length;
            var einde = document.cookie.indexOf(";", begin);
            if (einde == -1) {
                einde = document.cookie.length;
            }
            return document.cookie.substring(begin, einde);
        }
    }
}

function clearCookie(naam) {
    setCookie(naam, "", -1);
}


function maakKnop(tekst) {
    var eKnop = document.createElement("button");
    var sTekst = document.createTextNode(tekst);

    eKnop.appendChild(sTekst);
    eKnop.setAttribute('type', 'button');
    return eKnop;
}

function rekeningOpenen() {
    console.log("rekening geopend");
    var sNaam = window.prompt("Uw naam, graag?", "");
    if (sNaam!="" && sNaam != null) {
        setCookie('klantnaam', sNaam, 100);
        setCookie('saldo', 100, 100);
        window.history.go(0);
    }
}

function rekeningSluiten() {
    clearCookie('klantnaam');
    clearCookie('saldo');
    window.history.go(0);
}

function toonWaarschuwing(msg) {
    var eWarning = document.querySelector('.waarschuwing');
    eWarning.innerHTML = msg;
    eWarning.style.display = "block";
}

function berekenen(bewerking) {
    var nNieuwSaldo = 0;
    var eBedrag = document.getElementById('bedrag');
    var sBedrag = eBedrag.value;
    var sSaldo = getCookie('saldo');
    var sBericht = "";

    if (sSaldo != null && sSaldo != "") {
        if (sBedrag != "" && !isNaN(sBedrag)) {
            nSaldo = parseFloat(sSaldo);
            nBedrag = parseFloat(sBedrag);

            switch (bewerking) {
            case '+':
                nNieuwSaldo = nSaldo + nBedrag;
                break;
            case '-':
                nNieuwSaldo = nSaldo - nBedrag;
                break;
            }
            if (nNieuwSaldo <= 0) {
                var nMax = nSaldo - 1;
                sBericht += "Uw saldo is onvoldoende om dit bedrag af te halen. ";
                sBericht += "U kunt maximaal " + nMax + " Euro afhalen.";
                eBedrag.value = nMax;
                eBedrag.focus();
                toonWaarschuwing(sBericht);
            } else {
                setCookie('saldo', nNieuwSaldo, 100);
                window.history.go(0);
                eBedrag.value = "";
            }
            
        } else {
            alert("U moet een correct bedrag ingeven!");
        }
    } else {
        var bOpenen = window.confirm('U heeft nog geen rekening geopend, nu even doen?');
        if(bOpenen==true){rekeningOpenen()}
    }

}
/************** Onload ****************/

window.onload = function () {
    var eOutput = document.getElementById("output");
    var eKnopKrediet = document.getElementById("krediet");
    var eKnopDebiet = document.getElementById("debiet");

    var sMsg = '';
    var sNaam = 'nieuwe klant';
    var nSaldo = 0;

    if (getCookie('klantnaam')) {

        var sNaam = getCookie('klantnaam');
        var nSaldo = getCookie('saldo');

        sMsg += "Welkom " + sNaam + ",";
        sMsg += "uw saldo bedraagt " + nSaldo + " Euro";
        var eKnop = maakKnop('Sluit rekening');
        eKnop.addEventListener('click', rekeningSluiten);
    } else {
        sMsg += "Welkom beste bezoeker. ";
        sMsg += "Als u bij ons een nieuwe rekening opent, ontvangt u een startsaldo van 100 Euro!";

        var eKnop = maakKnop('Open rekening');
        eKnop.addEventListener('click', rekeningOpenen);
    }

    eKnopKrediet.addEventListener('click', function () { berekenen('+') });
    eKnopDebiet.addEventListener('click', function() { berekenen('-') });
    var dfBericht = document.createDocumentFragment();
    var eN1 = document.createElement('br');

    var tNode = document.createTextNode(sMsg);
    dfBericht.appendChild(tNode);
    dfBericht.appendChild(eN1.cloneNode(false));
    dfBericht.appendChild(eN1.cloneNode(false));
    dfBericht.appendChild(eKnop);

    eOutput.appendChild(dfBericht);
}