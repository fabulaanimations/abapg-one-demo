# ABAPG One — mock ISIDATA v7.1

## Badge, QR e posizione — ripristino v7.1

- **Tutti i ruoli:** Badge e posizione, con QR personale della matricola demo. Il badge identifica il profilo fittizio e non conferma una presenza a lezione.
- **Docente:** QR presenze dalla Home, dal menu o dal Registro. Scegliere una lezione della data demo e generare un QR valido per due minuti. Rigenerarlo invalida il precedente nello stesso archivio; il registro firmato chiude la raccolta presenze.
- **Studente:** Firma QR, scanner con fotocamera posteriore oppure codice incollato. Sullo stesso telefono è disponibile “Usa QR” per i codici generati dal docente in quel browser. Verificare la posizione e premere Conferma firma presenza. La presenza compare nel registro e non può essere duplicata.
- **Docente/ATA:** la timbratura del badge richiede una verifica di posizione valida; anche la firma finale del registro docente la richiede. Una bozza del registro può essere salvata senza posizione.
- **GPS e simulazione:** Verifica GPS richiede il permesso solo al tocco. “Simula in sede / fuori sede” permette test senza posizione reale; una posizione fuori sede o incerta blocca la conferma. La verifica scade dopo cinque minuti e si azzera al cambio account. Se si nega il permesso non viene dichiarata una posizione verificata.
- **Dati GPS:** coordinate elaborate solo in memoria; l’archivio registra esclusivamente modalità (GPS/simulata), esito e identificativo della sede, senza coordinate. Non viene attivato tracciamento continuo. La fotocamera si spegne alla lettura, al cambio pagina, al logout, quando la pagina viene nascosta o con Ferma fotocamera.

Il centro del geofence di prova (43.1133383, 12.3838233; raggio 150 m) deriva dal centro della mappa incorporata nella [pagina istituzionale Dove siamo](https://www.abaperugia.com/en/where-we-are/). È un riferimento indicativo per la demo, da calibrare e validare sul posto prima di un impiego effettivo. La precisione GPS viene considerata: oltre 100 m o a cavallo del confine, l’esito è incerto.

I QR sono leggibili ma **non costituiscono firme digitali o credenziali sicure**: il mock non dispone di un server o di chiavi di firma. Tra dispositivi diversi il QR può essere letto, ma ogni dispositivo registra nel proprio archivio; non c’è sincronizzazione. La revoca tramite rigenerazione è verificabile solo nell’archivio che ha generato il QR. Per la produzione occorrono validazione e revoca lato server.

Librerie locali, disponibili anche offline: [qrcode-generator 1.4.4](https://github.com/kazuhikoarase/qrcode-generator), MIT, e [jsQR 1.4.0](https://github.com/cozmo/jsQR), Apache-2.0; licenze nella cartella vendor. Le immagini della fotocamera vengono decodificate in memoria, senza upload. Camera e GPS reali restano da collaudare su un iPhone fisico.

Demo pubblica: https://fabulaanimations.github.io/abapg-one-demo/?v=7.1.1

Archivio **interamente fittizio**, eseguito nel browser. Non comunica con ISIDATA, non riproduce un contratto API ufficiale e non autentica utenti reali. Non inserire credenziali o dati personali reali. Le credenziali demo sono pubbliche.

## Accesso da iPhone

Aprire il link in Safari e scegliere un account con un tocco. In alternativa inserire uno degli username seguenti con password **demo123**.

| Username | Persona inventata | Area |
|---|---|---|
| studente | Sofia Rinaldi | Scenografia, secondo anno |
| studente.grafica | Tommaso Leoni | Graphic Design, primo anno |
| studente.pittura | Irene Rosati | Pittura, terzo anno |
| docente | Giulia Fontana | Insegnamenti di Scenografia |
| docente.grafica | Paolo Venturi | Insegnamenti di Graphic Design |
| docente.pittura | Elena Sereni | Insegnamenti di Pittura |
| ata | Luca Marini | Timbrature e richieste |
| segreteria | Chiara Ferri | Anagrafiche, iscrizioni, didattica, pagamenti, richieste |
| admin | Andrea Landi | Gestione, attività, esportazione e ripristino |
| studente.sospeso | Clara Fabbri | Iscrizione sospesa |
| studente.nuovo | Pietro Greco | Iscrizione da completare |
| studente.senzaiscrizione | Nora Silvestri | Anagrafica senza carriera |

Il selettore “Altri account e casi di test” contiene tutti i 24 account. “Cambia account” è sempre visibile, anche sul telefono. Il menu “Vai a” consente di raggiungere tutte le sezioni.

Per installare: Safari → Condividi → Aggiungi alla schermata Home. Dopo la prima apertura online attendere **Disponibile offline**. HTML, script, stili, fotografie e icone vengono conservati per l’uso senza rete. L’installazione effettiva su un iPhone fisico va provata sul dispositivo.

## Scenari di prova

La data accademica è bloccata al **12 ottobre 2026**, anno 2026/27. I log e le timbrature usano invece l’ora reale del test, indicata nell’interfaccia. Il calendario contiene quattro settimane di ottobre; non è un calendario annuale ufficiale.

1. Accedere come `studente`: verificare Scenografia, secondo anno, 60 CFA acquisiti, piano triennale da 180 CFA e lezioni coerenti. In Home o in Orario scegliere “Firma con QR”; generare prima il QR dall’account docente, quindi usare il codice disponibile oppure lo scanner.
2. Cambiare account in `docente`, aprire Registro e la stessa lezione: Sofia risulta presente. Compilare gli altri studenti, salvare una bozza, verificare la posizione (GPS o simulazione), quindi firmare. Una firma demo blocca le modifiche a quel registro. Rientrando come studente la presenza è visibile nella sezione Presenze.
3. Come studente prenotare un appello, verificare il cambio ad “Annulla prenotazione”; il docente vede il nominativo nell’elenco dei prenotati. Una prenotazione duplicata è respinta.
4. Simulare un pagamento: compare una ricevuta demo senza alcun addebito. La segreteria vede lo stesso stato.
5. Come ATA aprire Badge e posizione, verificare la posizione (GPS o simulazione) e timbrare entrata/uscita e inviare una richiesta con motivazione inventata. La segreteria può approvarla o respingerla; l’ATA vede l’esito.
6. Entrare come `studente.nuovo`: l’iscrizione non attiva impedisce orario operativo e prenotazioni. In Segreteria → Anagrafiche cercare Pietro Greco, aprire la scheda e rendere attiva l’iscrizione. Tornando all’account studente compaiono le lezioni del corso e dell’anno associati.
7. Confrontare Graphic Design e Pittura: piano, docenti, orari e CFA cambiano insieme al profilo. L’account senza iscrizione mostra lo stato vuoto, senza assegnazioni arbitrarie.
8. Come admin aprire Ambiente demo per esportare il JSON o ripristinare i dati iniziali. Il ripristino richiede una conferma nella pagina.

**Persistenza:** archivio e sessione sono salvati in localStorage sul browser utilizzato. Non c’è sincronizzazione tra dispositivi. Safari e la PWA installata possono avere archivi separati: per verificare un flusso condiviso cambiare account nello stesso contesto. Se lo storage non è disponibile, un avviso spiega che i dati restano solo in memoria. Il logout conserva i dati di test ma rimuove la sessione. Il vecchio selettore di ruolo non determina più l’accesso.

## Contenuto e struttura

- 24 anagrafiche: 18 studenti, 3 docenti, 1 ATA, 1 segreteria, 1 admin.
- 3 corsi, ciascuno con 18 insegnamenti: 60 CFA per anno e 180 nel triennio.
- 17 iscrizioni e piani; stati attiva, sospesa, da completare; un account senza iscrizione.
- 108 lezioni, registri e presenze storiche; appelli, risultati degli anni precedenti e 51 pagamenti.
- Prenotazioni, timbrature, richieste e attività amministrative modificabili localmente.

`mock-isidata.js` genera i dati con `seed()` e offre un adattatore `create(storage)`. Tutte le mutazioni verificano ruolo e relazioni fra utente, iscrizione, piano e insegnamento; `data()` restituisce la vista filtrata. Questi controlli sono utili per il mock, **non sono una barriera di sicurezza**: i dati di una pagina statica sono accessibili a chi usa il browser.

`app.js` gestisce login, navigazione e dashboard. `theme.css` conserva il tema dark premium esistente; le fotografie e i loghi originali sono stati riutilizzati. `app.css` aggiunge login e schede responsive per iPhone. Non sono richiesti font, librerie o feed remoti per il funzionamento.

Quando saranno disponibili le API ISIDATA: sostituire l’adattatore con un servizio autenticato lato server, verificare il contratto dati effettivo, mappare identificativi/iscrizioni, implementare autorizzazioni sul server e rimuovere il login demo. Non inserire chiavi API in GitHub Pages. Le firme, presenze e ricevute attuali sono solo simulazioni, senza valore amministrativo.

## Pubblicazione e sviluppo

GitHub Pages deve pubblicare la cartella radice di `main`. Non serve compilare. Caricare **tutto il contenuto** del pacchetto nella radice del repository, mantenendo la cartella `assets`; caricare il solo index.html non basta. I vecchi file nella cartella storica `ABAPG_One_GitHub_Pages` non sono l’app pubblicata e restano invariati.

Il manifest usa percorsi relativi e `display: standalone`. Il service worker conserva l’intera app, risponde offline alle navigazioni anche con query `?v=...` e cancella soltanto cache con prefisso `abapg-one-`. Quando cambiano risorse, aggiornare insieme i parametri di versione in index.html, CORE e CACHE_NAME nel service worker.

Test dei dati e dei flussi con Node.js:

```sh
node --test tests/mock.test.cjs
node --test tests/pwa.test.cjs
node --test tests/qr.test.cjs
```

In ambienti che impediscono processi figli aggiungere `--test-isolation=none`. Per la PWA servire la cartella via localhost o HTTPS; l’apertura diretta come file non supporta il service worker.
