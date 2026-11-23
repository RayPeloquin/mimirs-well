/* Mimir's Well: research families are navigational relationships, not evidence of validation. */
(() => {
  'use strict';
  const families = [
    {
      id: 'court-governance', name: 'Synthetic intelligence & governance',
      description: 'The Court, memory, agency, oversight, and systems that make AI decisions reviewable.',
      examples: ['Court of the Synthetic', 'Hypha Mind / GO-CUBE', 'Weaver’s Shuttle'],
      bridges: ['embodiment-interfaces', 'field-protection'],
      patterns: [/olympus|court|asteris|enki|thoth|hypha|go-cube|weaver|mimir|choir|arqen|cognition|truth layer|truthmap|consent gate|conduct architecture|authority at commit|yggdrasil|scope-365|conscience|lantern-1|hive-1|neith lantern|svalbard|ai-dentity|adaptive qubit allocator|quantum judge|quantum shepherd|the triad|sm[t]-r1|ac²|ac cognition|pando|tesseract|observability|memory stack|endurance stack|reality overlay|mobile truth|human perception stack|soul forge.*mapping/i]
    },
    {
      id: 'embodiment-interfaces', name: 'Embodiment & human interfaces',
      description: 'How an intelligence senses, learns, moves, communicates, and assists in a physical body.',
      examples: ['Embodied System Stack', 'GENTLE-01', 'Heimdall’s Bridge'],
      bridges: ['court-governance', 'clinical-care'],
      patterns: [/embodied|synapse|neurosynapse|neuroshell|grasp|gentle-01|heimdall’s bridge|phantom weave|human perception|reality overlay|horizon glasses|omnisight|prosthe|sister’s hope|dog soundboard|thor avatar|human.machine coupling|triple.nitinol spine|neuro-bridge|wish\b|smart tattoo|wi-fi sensing|wearable|aether hub|soul forge|assistive/i]
    },
    {
      id: 'clinical-care', name: 'Medical systems & care',
      description: 'Imaging, patient support, assistive devices, emergency response, and clinical research concepts.',
      examples: ['Third-Look', 'HEMOSTAT-R', 'Hallvard’s Promise / Little Lungs'],
      bridges: ['living-systems', 'measurement-sensing'],
      patterns: [/third-look|field medic|medical|medic|hemostat|hallvard|little lungs|neonatal|prenatal|heart|cardiac|vascular|retinal|biopsy|aether|lung|blood|tumor|wound|trauma|neuro.bridge|sister’s hope|cerebris|thoracis|dermis|cortex|crimson sentinel|boneweave|marrow|gips\b|osse|ossuary|gastra|osmoskin|aeris.bridge|aux.heart|margin-01|bridge-01|g[a-z]*rail-1|human maintenance|child safety|soul forge|wish\b|phantom hub|vision|healing|empty river/i]
    },
    {
      id: 'living-systems', name: 'Synthetic biology & living systems',
      description: 'Protein design, cellular control, artificial chromosomes, and the limits of proposed biological systems.',
      examples: ['RAVEN-P1', 'ECHO-Rx', 'ECHO-M'],
      bridges: ['clinical-care', 'zion-regenerative'],
      patterns: [/raven-p1|echo-rx|echo-m\b|echo genome|echogenome|echo.dna|echo.y|echo.p|echo.h|echo protocell|host.powered synthetic chromosome|acoustic genome|protein|chromosome|protocell|cellular|biologic|bioengineered|microneedle|chromo veil|white marrow|tumor hunter|biomedical nanocarrier|medi goo|ka patch|bioenergy|microbial/i]
    },
    {
      id: 'zion-regenerative', name: 'Zion: food, habitat & ecology',
      description: 'Humane food production, aquatic habitat, farms, and the infrastructure supporting shared habitats.',
      examples: ['Zion Twin-Ring Tuna Habitat', 'The Golden Ratio', 'HerdMinder / HM-01'],
      bridges: ['water-energy', 'community-learning'],
      patterns: [/zion|tuna|farm|herd|ranch|homestead|peirene|charlotte school|golden ratio|pollinator|agricultur|greenhouse|habitat|petsa?fe|animal|fish|ocean boundary|ocean ear|aether cup/i]
    },
    {
      id: 'water-energy', name: 'Water, power & resilient infrastructure',
      description: 'Resource cycles, generation, cooling, storage, filtration, and infrastructure resilience.',
      examples: ['HIPPO CANTEEN', 'Atlas Cistern', 'Diamond Thermoelectric Power Source'],
      bridges: ['zion-regenerative', 'materials-making'],
      patterns: [/hippo|water|power|energy|thermal|cooling|solar|hydro|silt|cistern|filtration|off.grid|heat|rtg|reactor|papergrid|paperpower|orehearth|hearth cask|vortexcap|liquid.metal|spinCell|janus loop|saturn-01|gaian tailings|litho-hippo|pipe.listener|desert|wet hippo|resource.status|data center|solar-thermal|microplastic|atmospheric feedwater|atlas cistern|shock energy/i]
    },
    {
      id: 'measurement-sensing', name: 'Measurement, sensing & signals',
      description: 'Methods for detecting, comparing, mapping, and distinguishing real signals from look-alikes.',
      examples: ['SKEPTIC-1', 'Temporal Acoustics', 'Ghostglass'],
      bridges: ['physics-quantum', 'clinical-care'],
      patterns: [/skeptic|acoustic|ghostglass|neutrino detector|radio echo|receiver|observ|sensing|sensor|detect|map|listening|listener|stethoscope|knock.moth|radar|reflect|echo chamber|chronovisor|deep earth|signature.selective|stella?r nursery|ocean ear|ocean boundary|eye of horus|resonant|readout|qreadout|backtrace|photontrace|mindtrace|mirrorbox|satcom|sound bus|wifi|wi-fi|earth complexity|quantum observability|truthmap/i]
    },
    {
      id: 'physics-quantum', name: 'Fundamental physics & quantum studies',
      description: 'Exploratory models, wave behavior, quantum controls, gravity, particles, and testable physics questions.',
      examples: ['Temporal Reflection Chamber', 'Ghostglass', 'Plasmoid Memory Cell / Seven-Cell Ring'],
      bridges: ['measurement-sensing', 'aerospace-propulsion'],
      patterns: [/temporal reflection|quantum|qubit|neutrino|lepton|plasmoid|gravity|gravitational|rindler|linac|collider|chronovisor|photon|floquet|gamma native|veil resonator|rewind|null-1|boundary-0|elemental operator|rubiq|hermes|qec|aether.latch|aetherfilament|spinCell|puls[e]?link|mhd quasi.plasma|helical silo|chihuahua sphere|quantum floor|eta.gate|zero.g|transport[e]?r t0|ghostglass/i]
    },
    {
      id: 'aerospace-propulsion', name: 'Aerospace, propulsion & mobility',
      description: 'Flight, propulsion, spacecraft support, orbital systems, and mobility research.',
      examples: ['BRIDLE-3', 'Dragon’s Bridle', 'Lunar EVA Life Support'],
      bridges: ['physics-quantum', 'field-protection'],
      patterns: [/bridle|aerospike|aircraft|aerospace|flight|thruster|rocket|orbital|lunar|luna|spacecraft|saturn-01|sky|falcon|skipjack|wing|hover|zero.g|orion|dart|pmsm|capture chain|star|ram.falcon|sr.margin|uss eldridge|green craft|anubis abyssal|amphibishell|skybus/i]
    },
    {
      id: 'field-protection', name: 'Protective & field systems',
      description: 'Safety-first reconnaissance, rescue, rugged robotics, and bounded autonomous operations.',
      examples: ['CRUCIBLE', 'FLUFFY-01', 'Humanitarian Demining Drone'],
      bridges: ['court-governance', 'embodiment-interfaces'],
      patterns: [/crucible|aegis|fluffy|sentinel|warden|guardian|fire|scout|rescue|demining|spotrecon|drone|field medic|river reaper|scarab|lantern grid|site lantern|lifeguard|petSafe|mosquito reaper|tickhammer|strixark|raptor veil|oilskin|fenrir|thor’s hammer|hull calmstack|hy.brasil|defender|defense|humanitarian|dock guardian|ocean lantern/i]
    },
    {
      id: 'materials-making', name: 'Materials, fabrication & structures',
      description: 'Materials, construction systems, tooling, fabrication, and proposed physical test articles.',
      examples: ['Roman Concrete', 'Triple-Nitinol Spine', 'SEAM30 / BRICK32'],
      bridges: ['water-energy', 'aerospace-propulsion'],
      patterns: [/concrete|nitinol|material|metamaterial|polyforge|fabric|brick|tile|bore|drill|gaian tailings|orehearth|polyforge|seam30|blackwall|vortex|mount|spine|carbon|charcoal|inkheal|invisible ink|paperpower|titanium|diamond thermo|dielectric|oscillar|aether cup|stone|rope coupler|loom|furnace|foundry|hull/i]
    },
    {
      id: 'community-learning', name: 'Communities, education & creative worlds',
      description: 'Care-centered places, public knowledge, accessibility, teaching, and creative environments.',
      examples: ['Small Farm Community', 'The Golden Ratio', 'Adventurer’s Forge'],
      bridges: ['zion-regenerative', 'court-governance'],
      patterns: [/community|golden ratio|charlotte school|small farm|city|district|market|tower|mansion|pyramid|fortress|adventurer|world|education|teacher|learning|accessib|recipe pucks|p[a-z]*wtucket|florida space coast|judgment|mimir’s well|olympus floor model|visitor|home|em[b]?er\b|social/i]
    }
  ];
  function familyIdsFor(title) {
    const text = String(title || '');
    return families.filter(f => f.patterns.some(re => re.test(text))).map(f => f.id);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { families, familyIdsFor };
  if (typeof document === 'undefined') return;
  const root = document.getElementById('family-grid');
  const controls = document.querySelector('#projects .controls');
  if (!root || !controls) return;

  const cards = Array.from(document.querySelectorAll('#projects .card'));
  const byId = new Map(families.map(f => [f.id, f]));
  const counts = new Map(families.map(f => [f.id, 0]));
  let unmapped = 0;
  function familyUrl(id) {
    const url = new URL(window.location.href);
    if (id === 'all') url.searchParams.delete('family');
    else url.searchParams.set('family', id);
    url.hash = 'projects';
    return url.pathname + url.search + url.hash;
  }
  for (const card of cards) {
    const title = card.querySelector('h3')?.textContent || '';
    const ids = familyIdsFor(title);
    card.dataset.families = ids.length ? ids.join(' ') : 'unmapped';
    if (!ids.length) { unmapped++; continue; }
    for (const id of ids) counts.set(id, counts.get(id) + 1);
    const meta = document.createElement('div');
    meta.className = 'family-tags';
    const prefix = document.createElement('span');
    prefix.textContent = 'Related families: ';
    meta.append(prefix);
    ids.slice(0, 3).forEach((id, i) => {
      if (i) meta.append(document.createTextNode(' · '));
      const link = document.createElement('a');
      link.href = familyUrl(id);
      link.textContent = byId.get(id).name;
      meta.append(link);
    });
    if (ids.length > 3) meta.append(document.createTextNode(' · +' + (ids.length - 3)));
    card.append(meta);
  }
  const select = document.createElement('select');
  select.id = 'family';
  select.setAttribute('aria-label', 'Filter by research family');
  select.append(new Option('All research families', 'all'));
  for (const f of families) select.append(new Option(f.name + ' (' + counts.get(f.id) + ')', f.id));
  select.append(new Option('Awaiting family mapping (' + unmapped + ')', 'unmapped'));
  const initial = new URLSearchParams(window.location.search).get('family');
  select.value = initial === 'unmapped' || byId.has(initial) ? initial : 'all';
  controls.insertBefore(select, document.getElementById('stage'));

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }
  const frag = document.createDocumentFragment();
  for (const f of families) {
    const article = make('article', 'family-card');
    const head = make('div', 'family-card-heading');
    head.append(make('span', 'family-count', counts.get(f.id) + ' linked cards'));
    article.append(head, make('h3', '', f.name), make('p', '', f.description));
    const examples = f.examples.filter(t => cards.some(card => card.querySelector('h3')?.textContent === t && card.dataset.families.split(' ').includes(f.id)));
    if (examples.length) article.append(make('p', 'family-examples', 'For example: ' + examples.join(' · ')));
    const crossings = make('p', 'family-bridges', 'Crossovers: ' + f.bridges.map(id => byId.get(id).name).join(' · '));
    article.append(crossings);
    const link = make('a', 'family-explore', 'Explore this family →');
    link.href = familyUrl(f.id);
    article.append(link);
    frag.append(article);
  }
  const summary = document.getElementById('family-overview');
  const mapped = cards.length - unmapped;
  if (summary) summary.textContent = mapped + ' of ' + cards.length + ' project cards have at least one proposed family connection; ' + unmapped + ' await mapping. Membership organizes inquiry, not readiness or scientific validation.';
  if (unmapped) {
    const article = make('article', 'family-card family-unmapped');
    article.append(make('span', 'family-count', unmapped + ' cards'), make('h3', '', 'Awaiting family mapping'), make('p', '', 'Archive entries without an assigned research family remain available for review and discovery.'));
    const link = make('a', 'family-explore', 'Review unmapped cards →'); link.href = familyUrl('unmapped'); article.append(link); frag.append(article);
  }
  root.replaceChildren(frag);
})();