# ABAPG One — Progetto funzionale completo

## Obiettivo
ABAPG One è l’app istituzionale proprietaria dell’Accademia di Belle Arti Pietro Vannucci. Deve diventare il punto unico di accesso quotidiano per Docenti, Personale ATA, Studenti, Segreteria e Amministratori, mantenendo ISIDATA come sistema gestionale ufficiale sottostante.

## Principi
- App proprietaria ABAPG.
- Unica identità digitale.
- Interfaccia diversa in base al ruolo.
- Mobile first, con versione web desktop.
- Integrazione bidirezionale con ISIDATA nella fase successiva.
- GPS usato per la timbratura, con principio di minimizzazione.
- Audit delle operazioni sensibili.
- Separazione netta tra interfaccia ABAPG e layer di integrazione ISIDATA.

## Ruoli
### Docente
Timbratura, calendario lezioni, registro elettronico, firma lezione, argomenti e note, presenze studenti, frequenze, appelli, esiti, aule, comunicazioni, fascicolo e profilo.

### Personale ATA
Timbratura, storico presenze, ferie, permessi, missioni, fascicolo, documenti, comunicazioni e profilo.

### Studente
Calendario, presenze, piano di studi, esami e prenotazioni, carriera, pagamenti/PagoPA, documenti, comunicazioni e profilo.

### Segreteria
Cruscotto operativo, anagrafiche, didattica, registri, presenze personale, frequenze studenti, aule, comunicazioni, report e gestione anomalie.

### Amministratore
Utenti e ruoli, policy, geofence, integrazioni, audit log, notifiche, configurazione e branding.

## Moduli
1. Autenticazione e identità
2. Home personalizzata
3. Timbratura e geofence
4. Didattica
5. Registro elettronico
6. Presenze studenti
7. Esami e verbalizzazione
8. Aule e spazi
9. Comunicazioni e push
10. Fascicolo e documenti
11. Ferie / permessi / missioni
12. Carriera studente
13. Pagamenti
14. Report
15. Audit
16. Configurazione
17. Integration layer ISIDATA

## Timbratura geolocalizzata
Flusso previsto: login → richiesta posizione → verifica precisione → verifica geofence → verifica eventuale dispositivo associato → registrazione evento → audit → sincronizzazione con ISIDATA.

Eccezioni: GPS disabilitato, precisione insufficiente, utente fuori sede, missione autorizzata, rete assente, doppia timbratura, rettifica amministrativa.

## Registro didattico
- lezioni del giorno
- apertura registro
- firma inizio/fine
- argomento svolto
- note
- presenze studenti
- storico
- lezioni non firmate
- correzioni secondo policy
- futura sincronizzazione bidirezionale ISIDATA

## Presenze studenti
Modalità previste: manuale docente, QR aula, QR dinamico, self check-in geolocalizzato opzionale, NFC/BLE in fase futura.

## Esami
Appelli, iscritti, ricerca studente, voto/idoneità, assente/ritirato, note, chiusura verbale e futura sincronizzazione ISIDATA.

## Aule
Disponibilità, prenotazioni, conflitti, capienza, dotazioni, manutenzione e possibile planimetria.

## Comunicazioni
Push e inbox interna, con target per tutti, ruolo, corso, insegnamento, gruppo o singolo utente; priorità e ricevute.

## Sicurezza
SSO, MFA per ruoli sensibili, device binding per timbratura, TLS, cifratura, RBAC, audit, rate limiting, revoca sessioni e log amministrativi.

## Privacy
GPS rilevato solo per l’evento necessario alla timbratura salvo policy diversa; conservazione limitata; minimizzazione; informativa specifica; autorizzazioni granulari.

## Architettura proposta
App iOS / Android / Web → API Gateway ABAPG → servizi ABAPG → database operativo/cache → Notification Service → Audit Service → Integration Layer → ISIDATA.

L’Integration Layer isola il codice ABAPG One dalle specifiche API ISIDATA.

## Entità principali
User, Role, Employee, Student, Course, Teaching, Lesson, LessonSignature, StudentAttendance, EmployeeAttendance, ExamSession, ExamBooking, ExamResult, Room, RoomBooking, Notification, Request, Document, AuditEvent, IntegrationEvent.

## Source of truth
Da definire formalmente per ogni dominio. Indicativamente: anagrafiche, corsi, insegnamenti, carriera e registri ufficiali in ISIDATA; notifiche, preferenze UI e dati propri ABAPG in ABAPG One.

## Sincronizzazione
Coda eventi, retry, idempotenza, dead-letter queue, riconciliazione, correlation ID e dashboard errori.

## Roadmap
### A — UX e prototipo
Approvazione struttura, branding, flussi, ruoli, demo.

### B — Specifica tecnica
Modello dati, API ABAPG, autenticazione, geofence, sicurezza e notifiche.

### C — ISIDATA
Richiesta documentazione e API, credenziali sandbox, mapping, test read-only, test write, audit e riconciliazione.

### D — MVP
Login, dashboard, timbratura, registro, presenze studenti e comunicazioni.

### E — Estensioni
Esami, aule, fascicolo, richieste, pagamenti e report avanzati.

## Criteri di accettazione MVP
Accesso per ruolo; dashboard; geofence configurabile; timbratura con audit; lista lezioni; registro e firma; presenze studenti; notifiche; log errori integrazione; ambiente di test; privacy e sicurezza formalizzate.
