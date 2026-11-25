"use strict";
/* Review annotations for the exact public transcriptions; not a parser, solver, or proof.
 * Dimensions ordered M,L,T,Theta. Null means not established/applicable.
 * Unit null means source does not establish a concrete unit; never guess.
 * "kind" preserves quantity meaning beyond dimensional exponents. */
(function(root){
const version="2026-11-25-v2";
// Reviewed local transcription snapshots, not remote original file hashes.
const sourcePins=Object.freeze({
  "skeptic-1": "171403329b2afa418b8093a7cb5581cc6643f303cb3c3ae9aa48cad82bda0a8e",
  "echo-rx": "d3bc0b1b6e23b6d22fbae02b62b49e95cc35f4d929992df4c0a9c35487a32687",
  "ghostglass": "884cd056681214e8063802314db07139ddbe021f3d4aae0c07bce4dd4086d716",
  "temporal-acoustics": "2308f4ee1e7b19591ab972ae8ab3b086e97c62769689e0512a811c3dfd8078bd",
  "chihuahua-sphere-cs-1": "d37b66407f5b81220f415c54c96e60281870da80907fff713c9eb4d20cec0184",
  "the-traveler-solar-electric-research-airship": "64ef0253d9cc1c7e83f9b366c80cd10b68380779b8c1270a9a70e3eb3b901ee6",
  "zion-twin-ring-tuna-habitat": "9b5173ccfb67dd6ae65b90c5c8dfefff44d82a3273bf0e6155e6fb30825a99f4",
  "adventurer-s-forge": "1eb019bc7e61f24e3a30e43969e664abef225325dab8fc4094080f0104d94326",
  "crucible": "fc17a513214be87c14e0b5d7e4ecd848d030055ae9a19324136f913c1ebf0aa1",
  "spotrecon-spotrecon-r2": "4cf34b585b40a7f26a01f11897dea3f6e0b29b08e1a108ad1fabd06b4022bbd6",
  "confluence-01-synthetic-sense": "6fab3d29d2abe18dff3f33464ed6b7d4f9dd98ca8193fd7ef737c0d793cd50cf",
  "spincell-dle": "1dfe0da9111c23f32c1c720154f6214385b92896798361a9652040de20f9de30"
});
const raw={
  "skeptic-1": {
    "lambda_i": [
      "0,0,-2,0",
      "1/s^2",
      "generalized eigenvalue"
    ],
    "K": [
      "1,0,-2,0",
      "N/m",
      "stiffness matrix"
    ],
    "M": [
      "1,0,0,0",
      "kg",
      "mass matrix"
    ],
    "f_i": [
      "0,0,-1,0",
      "Hz",
      "natural frequency"
    ]
  },
  "echo-rx": {
    "A_T": [
      "1,0,0,0",
      null,
      "active protein mass"
    ],
    "t": [
      "0,0,1,0",
      null,
      "elapsed time"
    ],
    "k_out": [
      "0,0,-1,0",
      null,
      "transfer coefficient"
    ],
    "A_D": [
      "1,0,0,0",
      null,
      "active protein mass"
    ],
    "k_clear": [
      "0,0,-1,0",
      null,
      "clearance coefficient"
    ],
    "k_spill": [
      "0,0,-1,0",
      null,
      "spillover coefficient"
    ]
  },
  "ghostglass": {
    "p": [
      "0,0,0,0",
      "1",
      "p-value"
    ],
    "n_on": [
      "0,0,0,0",
      "count",
      "on-window event count"
    ],
    "n_off": [
      "0,0,0,0",
      "count",
      "off-window event count"
    ],
    "r": [
      "0,0,0,0",
      "1",
      "exposure ratio"
    ]
  },
  "temporal-acoustics": {
    "c": [
      "0,1,-1,0",
      null,
      "wave speed"
    ],
    "dt": [
      "0,0,1,0",
      null,
      "simulation time step"
    ],
    "dx": [
      "0,1,0,0",
      null,
      "grid spacing"
    ]
  },
  "chihuahua-sphere-cs-1": {
    "eta_receiver": [
      "0,0,0,0",
      "1",
      "receiver efficiency"
    ],
    "eta_total": [
      "0,0,0,0",
      "1",
      "apparatus efficiency"
    ],
    "E_load": [
      "1,2,-2,0",
      "J",
      "load energy"
    ],
    "E_incident": [
      "1,2,-2,0",
      "J",
      "incident light energy"
    ],
    "E_electrical_total": [
      "1,2,-2,0",
      "J",
      "electrical input energy"
    ]
  },
  "the-traveler-solar-electric-research-airship": {
    "lap": [
      null,
      "boolean",
      "boolean"
    ],
    "lon": [
      "0,0,0,0",
      "deg",
      "unwrapped longitude"
    ],
    "lon_start": [
      "0,0,0,0",
      "deg",
      "start longitude"
    ],
    "approach": [
      null,
      "boolean",
      "boolean"
    ],
    "lap_already_observed": [
      null,
      "boolean",
      "boolean"
    ],
    "d": [
      "0,1,0,0",
      "km",
      "distance to start"
    ],
    "r": [
      "0,1,0,0",
      "km",
      "approach radius"
    ]
  },
  "zion-twin-ring-tuna-habitat": {
    "F_dye_percent": [
      "0,0,0,0",
      "%",
      "modeled dye fraction"
    ],
    "C_receiving": [
      null,
      null,
      "model dye sum"
    ],
    "C_initial": [
      null,
      null,
      "model dye sum"
    ]
  },
  "adventurer-s-forge": {
    "eta_Carnot": [
      "0,0,0,0",
      "1",
      "reversible efficiency ceiling"
    ],
    "T_cold": [
      "0,0,0,1",
      "K",
      "absolute sink temperature"
    ],
    "T_hot": [
      "0,0,0,1",
      "K",
      "absolute source temperature"
    ]
  },
  "crucible": {
    "p_observed": [
      "0,0,0,0",
      "1",
      "observed violation fraction"
    ],
    "N_violated": [
      "0,0,0,0",
      "count",
      "violating run count"
    ],
    "N_exercised": [
      "0,0,0,0",
      "count",
      "exercised run count"
    ]
  },
  "spotrecon-spotrecon-r2": {
    "delta_t": [
      "0,0,1,0",
      null,
      "observation age"
    ],
    "t_display": [
      "0,0,1,0",
      null,
      "clock timestamp"
    ],
    "t_capture": [
      "0,0,1,0",
      null,
      "clock timestamp"
    ]
  },
  "confluence-01-synthetic-sense": {
    "R_false": [
      "0,0,-1,0",
      "events/h",
      "false-event rate"
    ],
    "N_false": [
      "0,0,0,0",
      "count",
      "false-event count"
    ],
    "T_valid_hours": [
      "0,0,1,0",
      "h",
      "valid observation duration"
    ]
  },
  "spincell-dle": {
    "R_Li": [
      "0,0,0,0",
      "1",
      "lithium recovery fraction"
    ],
    "m_Li_recovered": [
      "1,0,0,0",
      null,
      "recovered lithium mass"
    ],
    "m_Li_in": [
      "1,0,0,0",
      null,
      "incoming lithium mass"
    ]
  }
};
const metadata=Object.freeze(Object.fromEntries(Object.entries(raw).map(([id,items])=>[id,Object.freeze(Object.fromEntries(Object.entries(items).map(([name,[dims,unit,kind]])=>[name,Object.freeze({dimensions:dims===null?null:Object.freeze(dims.split(",").map(Number)),unit,kind})]))) ])));
const get=(id,name)=>Object.hasOwn(metadata,id)&&Object.hasOwn(metadata[id],name)?metadata[id][name]:null;
function describe(m){if(!m)return "Unreviewed metadata";const dims=m.dimensions===null?"not established/applicable":m.dimensions.every(x=>x===0)?"dimensionless":["M","L","T","Theta"].map((k,i)=>m.dimensions[i]?k+"^"+m.dimensions[i]:"").filter(Boolean).join(" ");return "Unit: "+(m.unit===null?"not specified":m.unit)+"; dimensions: "+dims+"; quantity: "+m.kind;}
function compare(a,b){
  if(!a||!b)return {code:"unknown",text:"Metadata missing. Record evidence and acknowledge uncertainty before claiming equivalence.",blocked:false};
  if((a.kind==="boolean")!==(b.kind==="boolean"))return {code:"type-mismatch",text:"Boolean and numeric quantities cannot be identified as the same quantity.",blocked:true};
  if(a.kind==="boolean")return {code:"logical",text:"Both Boolean; review event definitions and sampling semantics. Logical type does not establish equivalence.",blocked:false};
  if(!a.dimensions||!b.dimensions)return {code:"unknown",text:"Physical dimensions not established. Record evidence and acknowledge uncertainty.",blocked:false};
  if(a.dimensions.some((v,i)=>v!==b.dimensions[i]))return {code:"dimension-mismatch",text:"Incompatible physical dimensions. Keep quantities separate; equivalence is blocked.",blocked:true};
  if(a.unit===null||b.unit===null)return {code:"unit-unknown",text:"Dimensions match; concrete units or scales are unspecified. Document unit and meaning review.",blocked:false};
  if(a.unit!==b.unit)return {code:"unit-review",text:"Dimensions match but unit/scale or representation differs. Document conversion or why comparison is inappropriate. No conversion is performed.",blocked:false};
  return {code:"meaning-review",text:"Dimensions and unit labels match; quantity meaning, context and assumptions still require review. Not proof of equivalence.",blocked:false};
}
const api=Object.freeze({version,metadata,sourcePins,get,describe,compare});
if(typeof module!=="undefined"&&module.exports)module.exports=api;
if(root)root.WellDimensionalWitness=api;
})(typeof window!=="undefined"?window:null);
