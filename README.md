# ABAPG One — mock ISIDATA v7.0

Demo pubblica: https://fabulaanimations.github.io/abapg-one-demo/?v=7.0.1

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

1. Accedere come `studente`: verificare Scenografia, secondo anno, 60 CFA acquisiti, piano triennale da 180 CFA e lezioni coerenti. In Orario scegliere “Simula presenza” su una lezione del 12 ottobre.
2. Cambiare account in `docente`, aprire Registro e la stessa lezione: Sofia risulta presente. Compilare gli altri studenti, salvare una bozza, quindi firmare. Una firma demo blocca le modifiche a quel registro. Rientrando come studente la presenza è visibile nella sezione Presenze.
3. Come studente prenotare un appello, verificare il cambio ad “Annulla prenotazione”; il docente vede il nominativo nell’elenco dei prenotati. Una prenotazione duplicata è respinta.
4. Simulare un pagamento: compare una ricevuta demo senza alcun addebito. La segreteria vede lo stesso stato.
5. Come ATA timbrare entrata/uscita e inviare una richiesta con motivazione inventata. La segreteria può approvarla o respingerla; l’ATA vede l’esito.
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
```

In ambienti che impediscono processi figli aggiungere `--test-isolation=none`. Per la PWA servire la cartella via localhost o HTTPS; l’apertura diretta come file non supporta il service worker.
