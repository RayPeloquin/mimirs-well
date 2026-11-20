/* Recovered design inventory, 16 November 2026. Entries describe archived work, not validation. */
(function(){
const groups=[["safety","Portfolio architecture","Mount Olympus — Cross-domain design and adversarial review\nCourt of the Synthetic — Multi-model engineering review\nOlympus Floor Model — Engineering project and portfolio control\nOlympus Registry — Design lineage and evidence catalog\nAC² — Admissible decision architecture\nEnki’s Will — Living safety stack\nEdge Reflex Mesh — Local control and safety reflexes\nYggdrasil Protocol — Governed adaptive systems\nLANTERN-1 — Supervised, budgeted AI inquiry\nCONSCIENCE-01 — Bounded machine advisory layer\nSCOPE-365 — Permission rehearsal\nQuantum Ribbon Worm — Governed quantum workload controller\nHypha Mind / GO-CUBE — Update-authorization testbed\nTRUTH LAYER — Confidence and uncertainty overlay\nQuantum Observability Layer — Infrastructure telemetry\nSVALBARD — Knowledge continuity and recovery\nAI-dentity — Identity and governance model"],["biology","Portfolio architecture","FIELD MEDIC — Guided-hand support\nLG–AETHER–01 — Biopsy permission and instrument-motion research\nAETHER HUB — Multimodal procedural guidance\nMARGIN-01 — Focused-ultrasound drug-delivery research\nBRIDGE-01 — Emergency ECMO transfer-support cradle\nCMH-01 — Contractile heart-material research\nArtificial Heart — Wireless power and dual reserves\nHEARTSEED — Cardiac support research\nGIPS — Intramedullary guidance and risk control\nVascular Whisperer — Vascular analysis and guidance\nPhantom Hub Medical — Medical telepresence\nSister’s Hope — Hand restoration gloves\nRetinal Flood Map — Retinal mapping research"],["infrastructure","Portfolio architecture","HIPPO Bus — Scheduled hybrid power distribution\nHIPPO Data Center Cooling Stack\nHIPPO CANTEEN — Water verification, treatment and stored power\nSILT HARP — Manual muddy-water prefiltration\nWet HIPPO Well — Gravity settling and manual routing\nDesert HIPPO Well — Atmospheric feedwater collection\nSHOFAR Mesh — Resource-status signaling\nPeirene Homestead Stack — Modular water infrastructure\nPIPE-LISTENER-01 — Plastic-pipe acoustic leak investigation"],["physics","Portfolio architecture","SR-MARGIN-01 — Spacecraft power and thermal audit\nHIPPO-MAG-01 — Magnetic-compensation experiment\nSignature-Selective Receiver — Detection and error bounds\nRoman Concrete — Finite-reserve self-healing model"],["robotics","Portfolio architecture","GENTLE-01 — Low-force gripper\nGRASP-01 — Grasp-recovery simulation benchmark\nHeimdall’s Bridge — Human–machine coupling and balance"],["safety","Research architecture","Asteris: Logical Flow and Location Module\nMimir’s Well — Where the Source Gathers\nAsteris Relay — Device connection and handoff\nHIVE-1 — Human–AI cognitive network\nThe Choir Protocol / CASG\nChoir on ARQEN\nARQEN — Architecture and interface contract\nThe Triad — Aegis, Heimdall and Enki’s Will\nATCB\nAuthority at Commit\nCourt on Trial\nOlympus Witness Rig\nWeaver’s Shuttle\nAsteris Daydream Loop\nAsteris Desktop Steward\nAC Cognition Engine\nEmbodied System Stack\nHuman Perception Stack\nReality Overlay Stack\nTruth Resolution Stack\nMobile Truth Stack\nConsent Gate\nConduct Architecture\nEnki’s Memory\nEnki’s Homeostasis\nSynapse of Enki\nThoth’s Mind\nEndurance Stack\nPHANTOM WEAVE\nSAFE CHANNEL — Negative Space Mapper\nTRUTHMAP\nSMT-R1 — Authenticated update governance\nCONFLUENCE-01 — Synthetic Sense\nQuantum Sovereign Stack\nVowed Self-Continuity Engine"],["biology","Research concept","HEMOSTAT-R\nHallvard’s Promise / Little Lungs\nEMH — Field Guide Gloves\nSoul Forge\nSoul Forge — Hand Mapping\nBlood Manager\nTumor Hunter\nMedi Goo\nGRAIL-1 — Hemocompatibility Doctrine\nGoverned Acoustofluidic System\nLung Mapper\nHorizon Glasses\nHeart of Osiris\nWi-Fi Sensing for Accessible Homes\nChild Safety Search Assist\nWISH — Virtual-motion research"],["infrastructure","Research concept","MICRO HIPPO FABRIC\nHIPPO Stack\nHIPPO DRAGON\nMIMIR-HIPPO — Extreme Energy Systems\nHIPPO Thunderlung\nHIPPO Thruster Array\nHIPPO Water Stack\nHIPPO Energy Variant\nGoverned Energy Transit System\nSound Bus\nAdaptive Pulse Process Control / APPC\nCrystal Damping Loop\nCrystal Security\nDiamond Thermoelectric Power Source\nVEIL-E-EDISON-01\nGhost Fiber\nCyber Meta-Material\nMHD Quasi-Plasma Rigidity\nDirect Beta Energy Harvester / RTG Study\nSEAM30 / BRICK32\nKnock-Moth — Pool-tile mapping\nSATCOM-01 — Ku-band VSAT terminal\nHFH Generalization Specification"],["physics","Research concept","Radio Echo Chamber\nChihuahua Sphere / CS-1\nStellar Nursery-01\nNDSM-01 — Neutrino feasibility study\nNeutrino Detector\nLepton Mitt\nPROBE-X EVERSOR\nQuantum Floor\nAdaptive Qubit Allocator\nQuantum Judge\nQuantum Quiet\nQuantum Shepherd\nLittle Gatekeeper\nHeimdall-QPL\nQBERT\nQF-01 — Numerical research\nHR-01 — Human Router\nTransporter T0 — State-transfer research\nHidden Heat — Mathematical study\nDragon’s Bridle\nBRIDLE-1 — Monolithic cellular aerospike\nBRIDLE-2\nX07 / Skipjack Integration\nSKIPJACK-LF — Hover feasibility\nLunaRecycle Backplate\nGreen Craft — Exterior concept\nUSS Eldridge — Working-physics research"],["robotics","Research concept","SITE LANTERN\nThe Dock Guardian\nOILSKIN SENTINEL\nFIREGROUND FUSION HUD\nOCEAN LANTERN GRID\nHULL CALMSTACK DEFENDER\nAegis Sentinel Mesh\nHY-BRASIL DOME\nRaptor Veil\nEye of Horus\nOdin’s Ravens\nPoseidon’s Trident\nFenrir\nThor\nThor’s Hammer\nThor Avatar\nMosquito Reaper\nTickhammer\nSPOTRECON / SPOTRECON R2\nWARDEN-1 — Farm Guardian\nHerdMinder / HM-01\nJaguar Mode\nFLUFFY-01\nDog Soundboard — Communication protocol\nTunneler\nBurst-Mode Subsurface Actuation\nDrone Rotor D1"],["community","Community concept","Small Farm Community\nThe Golden Ratio — Intergenerational Community\nCharlotte School — Intergenerational living and year-round gardens\nFortress of Solitude\nEmber — Animated companion"],["biology","Illustrated concept","Aeris-Bridge — Lung support\nAUX-HEART\nNeuro-Bridge\nThoracis — Bioperfusion\nCerebris — Trauma support\nDermis — Bioreactor / cradle\nCortex — Neural bioreactor\nNexus Bridge\nCrimson Sentinel — Surgical pod\nHuman Maintenance Stack\nEmpty River — Blood manufacturing\nWhite Marrow Foundry\nBoneweave\nPALEOFRAME-1\nNeurosynapse-1\nNeuroshell-1\nINKHEAL\nGASTRA — Gastric sleeve concept\nOSMOSKIN\nOSSUARY — Biomanufacturing\nAether Cup — Ophthalmic concept\nNeonatal / Prenatal Care Chamber\nBioengineered Hair-Follicle / Horn-Implant Concepts\nBiomedical Nanocarrier\nSmart Tattoo / Microneedle System\nInvisible Ink — Printing and removal\nChromo Veil\nECHO Genome / EchoGenome\nAcoustic Genome\nECHO-DNA / ECHO-Y / ECHO-P / ECHO-H\nHost-Powered Synthetic Chromosome\nHSX-01 / HSX-21"],["infrastructure","Illustrated concept","Hydrofell-01 — Hydro data center\nSilt HIPPO — Silo cistern\nAtlas Cistern\nOff-Grid Ranch Water System\nPaperPower — Water battery\nPAPERGRID-0\nOREHEARTH — Geothermal concept\nHearth Cask\nVortexcap — Supercapacitor\nHIPPO Vortex LMB\nThermal Grace Module\nThunder Vault\nBuoyant Impulse Pod\nJanus Loop — Supply recovery\nLiquid-Metal Cooling System\nPARSEVAL — Coolant system\nParseval Loom\nSpinCell DLE\nSaturn-01 — Processing concept\nSolar-Thermal Centrifuge\nGaian Tailings\nBlackwall — Fuel reclaimer\nCharcoal Microplastic Filtration\nOrichalcum Lattice\nOrichalcum Crown\nResonant Edge — Masonry saw\nResonant Brace\nWaterjet Cutter\nResonant Acoustic Core Drill\nModular Rope Coupler / Ranchline Utility\nTitanium Pressure-Adaptive Metamaterial Mount\nTriple-Nitinol Spine\nDevouring Lattice\nDielectric Threshold Mapper\nEta-Threshold — Material mapper\nDeep Earth Listening / Earth Stethoscope\nGaian Needle-Mole\nTB-01M Grootslang\nTelluric Borer\nTelluric Borehole\nTelluric Transmitter\nTelluric Accelerator / Mass Driver\nLITHO-HIPPO\nTorus Data Center\nTorus Vault\nVertical Vortex Silo Data Center\nPyramid Data Center\nNeural Web — Underground data center\nAH-1 / SH-1 — Underground campus"],["robotics","Illustrated concept","Firewell — Silo wildfire relief\nAcoustic Snuffer — Wildfire convoy\nAtmospheric Firefighting System\nOcean Ear\nOcean Boundary Residual Inference\nPolyforge-1 — Ocean cleanup ship\nRiver Reaper Walker\nPlanetary Stitch\nEarth Complexity Monitor\nBAMBOO-RF — Agricultural tolerance concept\nStrixArk — Owl conservation\nPollinator Habitat Electric Steamer\nLifeguard Lance — Rescue drone and fleet\nPetSafe — Drone backpack\nGhostwalker Scout\nSCARAB-DC — Shipboard repair\nSCARAB-RF\nScarab-4\nLANTEX-24 / LANTEX-PRO — Lanternfly drone\nHumanitarian Demining Drone"],["physics","Illustrated concept","Gravity Thief — Launch concept\nSky-Spine Observatory\nSkybridle — Aircraft safety\nAircraft Belly-Landing Energy System\nRAM-FALCON\nAnubis Abyssal Gill\nAmphibishell\nFSAMS-SKIN — EVA concept\nAether Shroud\nLunar EVA Life Support\nAnubis Wing — Flight suit\nSky Wing\nSkybus\nOutlaw Hovercruiser\nAetheris Octad — Skycity\nZero-G Pod\nOrbital Pressure Corridor / Beam Handoff\nEM Capture Chain — Spacecraft concept\nORION — Orbital recycling\nPULSELINK — Reentry\nS2M-DART\nLINC-DART-01\nPMSM — Space sample microscope\nETA-GATE — Light elevator\nAether-Latch Memory\nAetherfilament Memory\nPlasmoid Memory Cell / Seven-Cell Ring\nPLA-1 — Plasmoid laser communications array\nVSRL-01 — Accelerator\nFolded Linac\nHelical Silo Collider\nHadron Seed Chamber\nVeil Resonator\nVeil Gate — Exotic lattice\nChronovisor\nChronos Bridge\nChrono Veil\nQuantum Slice Teleporter\nQuantum Secure Field Communications\nHermes Quantum Queue\nBounceQEC\nFloquet Wave Processor\nGamma Native / Quantum Optical Foundry\nQReadout\nSTACK-NV — Sensor family\nEuplectella Node A / Node B\nREWIND-II — Plasma concept\nGravitationally Coupled Clock\nRindler Habitat\nBOUNDARY-0 / BOUNDARY-0X\nNULL-1 / NULL-1H / SHIELD-1\nDEUTERION\nPhysics Operating System\nElemental Operator Atlas / Rubik Engine\nRUBIQ\nXFORM-Q88\nATTRACTOR\nMindTrace / PhotonTrace\nBACKTRACE\nMIRRORBOX M01\nReality Stress Engine"],["safety","Illustrated concept","Mercurius / ECHO Mercurius\nHypha Mesh\nHypha Ear\nHypha Rootway\nPando Bridge\nPando Tongue\nEcho Bowl\nNEITH LANTERN Gate\nAEGIS Veil / Veilkeeper\nAEGIS BufferShield\nAEGIS-10\nJANUS-10\nAREOPAGUS\nARBOR / SEED\nConcordia\nHephaestus — Autonomous forge\nAG-DAS Guardian\nPaperCall / PaperCall Sky\nPaper Factory\nMECHAGE\nLAAF PINN\nOmniSight Goggles\nHBFTune — EEG concept\nKA Patch — Bioenergy jewelry\nKA Lock\nKA Fold\niExalt Node"],["community","Illustrated concept","MA’AT Tower\nJudgment Pyramid\nStone Mansion District\nPawtucket Riverside Market / Fleet District\nRecipe Pucks\nLee Vertical City / Quick City Seven\nFlorida Space Coast Autonomous Systems Innovation Park"]];
// Keep the distinct protocell concept under the ECHO research family without conflating it with the host-coupled ECHO Genome.
groups.push(['biology','Illustrated concept','ECHO Protocell — Resonant and Provisioned Seed']);
const labels={safety:'AI & governance',biology:'Biology & medicine',physics:'Physics & aerospace',infrastructure:'Water, power & infrastructure',robotics:'Robotics & field systems',community:'Communities & creative work',defense:'The Armory · Defense & Protective Systems'};
// Public-facing grouping only: do not infer readiness, military qualification or weapon capability.
const armoryDivisions=new Map([
 ['FIELD MEDIC — Guided-hand support','Battlefield medicine'],
 ['HEMOSTAT-R','Battlefield medicine'],
 ['Humanitarian Demining Drone','Autonomous support'],
 ['Ghostwalker Scout','Autonomous support'],
 ['Odin’s Ravens','Detection & awareness'],
 ['Aegis Sentinel Mesh','Detection & awareness'],
 ['OILSKIN SENTINEL','Protective systems'],
 ['HULL CALMSTACK DEFENDER','Protective systems'],
 ['AEGIS Veil / Veilkeeper','Protective systems'],
 ['AEGIS BufferShield','Protective systems'],
 ['AEGIS-10','Protective systems'],
 ['AG-DAS Guardian','Protective systems'],
 ['Weaver’s Shuttle','Security & resilience'],
 ['NEITH LANTERN Gate','Security & resilience'],
 ['Poseidon’s Trident','Advanced defense concepts'],
 ['Thor’s Hammer','Advanced defense concepts'],
 ['Tickhammer','Advanced defense concepts'],
 ['Fenrir','Advanced defense concepts'],
 ['HY-BRASIL DOME','Advanced defense concepts'],
]);
const grid=document.querySelector('.grid');
document.querySelectorAll('.card').forEach(c=>{c.dataset.stage='repository';const badge=document.createElement('span');badge.className='stage';badge.textContent='Public repository';c.querySelector('h3').before(badge)});
const third=document.createElement('article');third.className='card';third.dataset.category='biology';third.dataset.stage='repository';
const top=document.createElement('div');top.className='cardtop';const thirdIndex=document.createElement('span');thirdIndex.className='index';thirdIndex.textContent='10 /';const tag=document.createElement('span');tag.className='tag';tag.textContent='Biology & medicine';top.append(thirdIndex,tag);
const stage=document.createElement('span');stage.className='stage';stage.textContent='Public repository';
const h=document.createElement('h3');h.textContent='Third-Look';
const p=document.createElement('p');p.textContent='Three-camera wound-imaging handpiece research. Explore the design, development record and limitations.';
const a=document.createElement('a');a.href='https://github.com/RayPeloquin/Third-Look-Three-Camera';a.textContent='Open project repository ↗';third.append(top,stage,h,p,a);grid.append(third);
// AEGIS-TWIN v0.6 has a public overview, but its safety and human-interface work is still conceptual.
const aegis=document.createElement('article');aegis.className='card';aegis.dataset.category='robotics';aegis.dataset.stage='repository';
const aegisTop=document.createElement('div');aegisTop.className='cardtop';
const aegisIndex=document.createElement('span');aegisIndex.className='index';aegisIndex.textContent='11 /';
const aegisTag=document.createElement('span');aegisTag.className='tag';aegisTag.textContent='Robotics & field systems';
aegisTop.append(aegisIndex,aegisTag);
const aegisStage=document.createElement('span');aegisStage.className='stage';aegisStage.textContent='Public concept overview';
const aegisHeading=document.createElement('h3');aegisHeading.textContent='AEGIS-TWIN v0.6';
const aegisNote=document.createElement('p');aegisNote.textContent='Hybrid protective exosleeves and an artificial nervous-system research concept. Intact-arm augmentation and separate limb-restoration interfaces; no human-use validation.';
const aegisLink=document.createElement('a');aegisLink.href='aegis-twin.html';aegisLink.textContent='See the concept and cutaway ↗';
aegis.append(aegisTop,aegisStage,aegisHeading,aegisNote,aegisLink);grid.append(aegis);
// FQSC-01 is an original, simulation-first physics concept rather than a validated instrument.
const fqsc=document.createElement('article');fqsc.className='card';fqsc.dataset.category='physics';fqsc.dataset.stage='documented';
const fqscTop=document.createElement('div');fqscTop.className='cardtop';
const fqscIndex=document.createElement('span');fqscIndex.className='index';fqscIndex.textContent='12 /';
const fqscTag=document.createElement('span');fqscTag.className='tag';fqscTag.textContent='Physics & aerospace';fqscTop.append(fqscIndex,fqscTag);
const fqscStage=document.createElement('span');fqscStage.className='stage';fqscStage.textContent='Simulation-first research concept';
const fqscHeading=document.createElement('h3');fqscHeading.textContent='FQSC-01';
const fqscNote=document.createElement('p');fqscNote.textContent='Field-Quench Spectral Coupling: a proposed confined-ion research instrument comparing internal excitation with motion under changing electromagnetic fields. Concept only; no hardware or measurements.';
const fqscLink=document.createElement('a');fqscLink.href='fqsc-01.html';fqscLink.textContent='Explore the design and research gates ↗';
fqsc.append(fqscTop,fqscStage,fqscHeading,fqscNote,fqscLink);grid.append(fqsc);
let number=13;
// These titles are retained in the historical inventory but excluded from the public Well.
const withdrawnTitles=new Set([
 'Charlotte School — Intergenerational living and year-round gardens',
 'Fortress of Solitude',
 'Ember — Animated companion',
 'Judgment Pyramid',
 'Stone Mansion District',
 'Thor Avatar',
]);
// Separate catalog record for the artwork. The archived QBERT title is unchanged.
const qubitCard=document.createElement('article');
qubitCard.className='card';qubitCard.dataset.category='physics';qubitCard.dataset.stage='concept';
const qubitTop=document.createElement('div');qubitTop.className='cardtop';
const qubitIndex=document.createElement('span');qubitIndex.className='index';qubitIndex.textContent=String(number++).padStart(2,'0')+' /';
const qubitTag=document.createElement('span');qubitTag.className='tag';qubitTag.textContent=labels.physics;
qubitTop.append(qubitIndex,qubitTag);
const qubitStage=document.createElement('span');qubitStage.className='stage';qubitStage.textContent='Concept artwork · Project provenance unverified';
const qubitHeading=document.createElement('h3');qubitHeading.textContent='Qubit — Ankh Assembly';
const qubitNote=document.createElement('p');qubitNote.textContent='Ankh-centered cryogenic quantum-computing concept artwork. No built device or measured qubit operation is documented. Original project name and design version remain unconfirmed. This is not QBERT.';
const qubitLink=document.createElement('a');qubitLink.href='#qubit-art';qubitLink.textContent='View the Ankh Qubit artwork ↗';
qubitCard.append(qubitTop,qubitStage,qubitHeading,qubitNote,qubitLink);grid.append(qubitCard);

groups.forEach(([category,status,titles])=>titles.split('\n').filter(title=>!withdrawnTitles.has(title)).forEach(title=>{
 const armoryDivision=armoryDivisions.get(title);
 const publicCategory=armoryDivision?'defense':category;
 const card=document.createElement('article');card.className='card';card.dataset.category=publicCategory;card.dataset.stage=status==='Illustrated concept'?'concept':'documented';
 const top=document.createElement('div');top.className='cardtop';
 const index=document.createElement('span');index.className='index';index.textContent=String(number++).padStart(2,'0')+' /';
 const tag=document.createElement('span');tag.className='tag';tag.textContent=labels[publicCategory];top.append(index,tag);
 const badge=document.createElement('span');badge.className='stage';badge.textContent=status==='Portfolio architecture'?'Portfolio listing':status==='Illustrated concept'?'Recovered concept title':status==='Community concept'?'Archived community title':'Archived design title';
 const heading=document.createElement('h3');heading.textContent=title;
 const note=document.createElement('p');
 note.textContent=status==='Illustrated concept'?'Archive title only. Mechanism, feasibility and supporting evidence have not yet been reviewed.':status==='Portfolio architecture'?'Listed in the October 2026 selected portfolio. Mechanism, feasibility and supporting evidence review pending.':'Archived design title. Mechanism, feasibility and supporting evidence review pending.';

 if(title==='ECHO Protocell — Resonant and Provisioned Seed')note.textContent='Two illustrated minimal-cell proposals: a resonant energy-harvesting seed (v0.3) and a chemically supplied, provisioned seed (v0.4). Both remain speculative concepts; no constructed protocell, self-sustaining operation, replication or containment validation is established.';
 card.append(top,badge,heading,note);
 if(armoryDivision){const division=document.createElement('small');division.className='alias';division.textContent=armoryDivision+' · Research status unchanged';card.append(division)}
 if(title.startsWith('Sister’s Hope')){note.textContent='A proposed assistive glove concept exploring support for hand movement and everyday tasks. Design review and testing are pending; clinical benefit has not been established.';const alias=document.createElement('small');alias.className='alias';alias.textContent='Former archive title: Mimir’s Well — Hand Restoration Glove.';card.append(alias)}
 if(title.startsWith('Mimir’s Well')){note.textContent='A research architecture for AI discovery, collaboration and traceable findings. Separate from the former glove project.'}
 if(title==='KA Patch — Bioenergy jewelry'){
   note.textContent='KA PATCH v1.0 explores body-coupled micro-energy harvesting for low-power wearables. Concept only: no measured power output or clinical validation. Pilot 001 in the Divergence Ledger separates intent, observations, and alternative uses.';
   const ledgerLink=document.createElement('a');
   ledgerLink.href='divergence-ledger.html';
   ledgerLink.textContent='Read pilot 001 · Divergence Ledger ↗';
   card.append(ledgerLink);
 }

 grid.append(card);
}));
// Promote already-listed repository projects without creating duplicate project cards.
for(const [name,division] of [['CRUCIBLE','Security & resilience'],['AEGIS-TWIN v0.6','Protective systems']]){
 const card=[...grid.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent===name);
 if(!card)continue;
 card.dataset.category='defense';
 const tag=card.querySelector('.tag');if(tag)tag.textContent=labels.defense;
 const label=document.createElement('small');label.className='alias';label.textContent=division+' · Research status unchanged';card.append(label);
}
const controls=document.querySelector('#projects .controls');
if(controls){
 const button=document.createElement('button');button.type='button';button.dataset.filter='defense';button.setAttribute('aria-pressed','false');button.textContent='The Armory';controls.append(button);
 const introduction=document.createElement('div');introduction.className='catalog-help';introduction.hidden=true;
 const heading=document.createElement('strong');heading.textContent='The Armory · Defense & Protective Systems';
 const description=document.createElement('p');description.textContent='Protective systems · Battlefield medicine · Detection & awareness · Autonomous support · Security & resilience · Advanced defense concepts. Civilian Skunk Works research: no military qualification, hardware performance or safety certification is implied.';
 const principle=document.createElement('p');principle.textContent='Protection first. Evidence always. We do no harm.';
 introduction.append(heading,description,principle);controls.after(introduction);
 controls.querySelectorAll('[data-filter]').forEach(choice=>choice.addEventListener('click',()=>{introduction.hidden=choice.dataset.filter!=='defense'}));
}
})();
