/**
 * Created by David Maser on 10/07/2017.
 */
import {Template} from '../config/Template';
export default function FastNav(option,expression){
  option = option || 'horizontal';
  let objLayout = Template.nav.layout;
  let objNode = Template.nav.node.layout;
  let objNodeEntry = Template.nav.node.entry;
  let objNodeString = objNode.replace('@node',objNodeEntry);
  let objString = objLayout.replace('@nav.node',objNodeString);
  let jsonParse,jsonObj;
  try{
    jsonObj = JSON.parse(expression);
    jsonParse = true;
  }catch(e){
    jsonParse = false;
  }
  if(jsonParse){
    if(typeof jsonObj === 'object'){
      let o,nodeString='';
      for(o in jsonObj){
        nodeString += o === 'master' ? jsonObj[o] : parseChildren(jsonObj[o]);
      }
      return objLayout.replace('@nav.node',nodeString);
    }
  }
  function parseChildren(obj){
    let c,childString = '';
    for(c in obj){
      childString += objNodeEntry.replace('@node.entry',obj[c])
    }
    return objNode.replace('@node',childString);
  }
}