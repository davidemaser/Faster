/*
 * Created by David Maser on 18/07/2017.
 */
import {Template} from '../config/Template';
import {Global} from '../config/Global';
import {FastUtilities} from './FastUtilities';
export default function (option,expression) {
  const parser = {
    handleAction:function(param){
      $(Global.appRoot).on('click','.ftx__banner_button',function(){
        let ctaAction = $(this).parent().parent().attr('ftx-action');
        console.log(ctaAction);
      })
    },
    params:function(obj){
      let subItem = 'banner';
      let o;
      let objString = '';
      let parentString = '';
      for (o in obj) {
        let objType = obj[o].split(':')[0].replace('{','').replace('}','');
        let objTemplate = Template[subItem][objType];
        let objContent = obj[o].split(':')[1].replace('{','').replace('}','');
        if(objType === 'image'){
          parentString = objTemplate.replace(`@${subItem}.${objType}`,objContent);
        }else if(objType === 'action'){
          if(parentString.length > 0){
            parentString = parentString.replace(`@${subItem}.${objType}`,objContent);
          }
        }else{
          objString += objTemplate.replace(`@${subItem}.${objType}`,objContent);
        }
      }
      let uniqueId = FastUtilities.genFtxId();
      this.handleAction(uniqueId);
      return parentString.replace('@ftx.id',uniqueId).replace('@banner.content',objString);
    },
    init: function (obj) {
      if (obj.indexOf(',') > -1) {
        return this.params(obj.split(','));
      }
    },

  };
  option = option !== null ? option : '';
  let bannerArray = expression.trim().split(/\r?\n/);
  let bannerTemplate = Template.banner.layout;
  let bannerContent = '';
  if(Array.isArray(bannerArray)){
    bannerArray.map(function(a){
      if(a.indexOf('{') > -1){
        bannerContent += parser.init(a.trim());
      }else{
        let isNonObject = $('<div />').html(a.trim()).contents().addClass('ftx__banner').addClass('container');
        bannerContent += isNonObject[0].outerHTML;
      }
    })
  }
  bannerTemplate = bannerTemplate.replace('@option',option).replace('@content',bannerContent);
  return bannerTemplate;
}