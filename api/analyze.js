const https=require("https");
module.exports=function(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS"){res.status(200).end();return;}
  if(req.method!=="POST"){res.status(405).json({error:"Method not allowed"});return;}
  const body=JSON.stringify(req.body);
  const options={hostname:"api.anthropic.com",path:"/v1/messages",method:"POST",headers:{"Content-Type":"application/json","x-api-key":"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","anthropic-version":"2023-06-01","Content-Length":Buffer.byteLength(body)}};
  const r=https.request(options,(resp)=>{
    let d="";
    resp.on("data",(c)=>{d+=c;});
    resp.on("end",()=>{res.setHeader("Content-Type","application/json");res.status(resp.statusCode).send(d);});
  });
  r.on("error",(e)=>{res.status(500).json({error:e.message});});
  r.write(body);
  r.end();
};
