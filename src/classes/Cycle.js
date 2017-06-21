/**
 * Created by David Maser on 21/06/2017.
 */
import {Faster,Architect} from '../components/Faster';
import {Global} from '../config/Global';
import Processor from '../Functions/Processor';
import Woops from './Woops';
export default class Cycle{
  constructor(type){
    this.type = type;
    this.tag = Global.node;
    this.xTag = Global.experiment.node;
    this.nested = Global.experiment.nested;
    this.ignore = Global.ignore;
    this.run();
  }
  run(){
    switch (this.type){
      case 'ft':
        let ftNodes = [];
        $(`${this.tag}:not([${this.ignore}])`).each(function(a){
          $(this).attr('fst-id',a);
          $(this).html() !== '' && $(this).html() !== undefined && $(this).html() !== null ? ftNodes.push($(this).html()) : $(this).remove();
        });
        ftNodes.map((a,b)=>{
          let nodeType,nodeString;
          if(a.indexOf('render:') > -1){
            nodeType = Faster.extract.node.type(a);
            nodeString = `<${nodeType} class="${Faster.extract.class(a)}">`;
          }else{
            if(a.indexOf('template:') > -1 ){
              nodeString = Faster.extract.template(a);
            }else{
              new Woops({
                origin:'Sniffer.cycle',
                type:'Missing attribute',
                message:'Unable to process this object. It has no assigned type or template',
                log:false
              });
            }
          }
          nodeString = Faster.parse.noLineBreaks(nodeString);
          nodeString += Faster.extract.content(a) !== undefined ? `${Faster.extract.content(a)}</${nodeType}>` : null;
          let nodeElement = $('body').find(`[fst-id="${b}"]`);
          $.when(Architect.build.element(nodeElement,nodeString,Faster.extract.content(a))).then(()=>{
            Faster.exec();
          })
        });
        break;
      case 'ftx':
        let ftxNodes = [];
        $(`${this.xTag}:not([${this.ignore}]):not([${this.nested}])`).each(function(a){
          $(this).attr('fstx-id',a);
          $(this).html() !== '' && $(this).html() !== undefined && $(this).html() !== null ? ftxNodes.push($(this).html()) : $(this).remove();
        });
        ftxNodes.map((a,b)=>{
          let xType,xOption=null,bounds,xStatement;
          if(a.indexOf(':') > -1){
            xType = a.split(':')[0].replace('{','');
            xOption = a.split(':')[1].split('}')[0];
            bounds = [`{${xType}:${xOption}}`,`{~${xType}}`];
            xStatement = a.split(bounds[0])[1].split(bounds[1])[0];
          }else{
            xType = a.split('{')[1].split('}')[0];
            bounds = [`{${xType}}`,`{~${xType}}`];
            xStatement = a.split(bounds[0])[1].split(bounds[1])[0];
          }
          let ftxNodeElement = $('body').find(`[fstx-id="${b}"]`);
          Architect.build.experiment(ftxNodeElement,Global.experiment.render,Processor(xType,xOption,xStatement));
        });
        break;

    }
  }
}