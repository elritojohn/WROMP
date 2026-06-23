// WROMP Shared Lookup Library v2.0

let WROMP={businesses:[]};

async function loadBusinesses(){
  const txt=await (await fetch("data/businesses_master.csv")).text();
  const lines=txt.trim().split(/\r?\n/);
  const hdr=lines.shift().split(",");

  function csv(line){
    return line.match(/(".*?"|[^",]+|)(?=,|$)/g).slice(0,-1).map(x=>x.replace(/^"|"$/g,""));
  }

  WROMP.businesses=lines.map(line=>{
    const vals=csv(line);
    let r={};
    hdr.forEach((h,i)=>r[h.trim()]=(vals[i]||"").trim());
    return r;
  }).sort((a,b)=>a.Business_Name.localeCompare(b.Business_Name));
}

async function initWROMP(){
  await loadBusinesses();

  const input=document.getElementById("business_name");
  const list=document.getElementById("business_list");
  if(!input||!list)return;

  list.innerHTML="";
  WROMP.businesses.forEach(b=>{
    const o=document.createElement("option");
    o.value=b.Business_Name;
    list.appendChild(o);
  });

  input.addEventListener("input",()=>{
    const b=WROMP.businesses.find(x=>x.Business_Name===input.value);
    if(!b)return;

    const set=(id,v)=>{
      const e=document.getElementById(id);
      if(e)e.value=v||"";
    };

    set("category",b.Facility_Type);
    set("contact_name",b.Contact_Name);
    set("phone",b.Phone);
    set("email",b.Email);
    set("website",b.Website);
    set("town",b.Town);
    set("state",b.State);
    set("zip",b.ZIP);
    set("county",b.County);
  });

  console.log("Loaded businesses:",WROMP.businesses.length);
}
