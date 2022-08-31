import { Button } from "@mui/material";


function Link({link,idx,savedLinks,setSavedLinks}) {

  function addToSavedLinks(){
    if(!savedLinks.includes(link)){
      setSavedLinks([...savedLinks, link])
    }
  }

  return ( 
    <>
    <div className="container-row link" >
      <h4>
      <a href={link.url}>{link.url} {idx + 1}</a>
      </h4>
      <h4> ({link.numLikes} Reactions )</h4>
      <Button onClick={addToSavedLinks}>Save</Button>
    </div>
    </>
   );
}

export default Link;