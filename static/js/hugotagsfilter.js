/**
 * @name 'Hugo Tags Filter'
 * @version 1.2.2
 * @license MIT  
 * @author PointyFar 
 */ 

 class HugoTagsFilter {
    constructor(config) {
      var defaultFilters = [
        {
          name: 'tag',
          prefix: 'tft-',
          buttonClass: 'tft-button',
          allSelector: '#tfSelectAllTags',
          attrName: 'data-tags'
        },
        {
          name: 'section',
          prefix: 'tfs-',
          buttonClass: 'tfs-button',
          allSelector: '#tfSelectAllSections',
          attrName: 'data-section'
        }
      ]
      
      this.FILTERS = (config && config.filters) ? config.filters : defaultFilters;
      this.showItemClass = (config && config.showItemClass) ? config.showItemClass : "tf-show";
      this.activeButtonClass = (config && config.activeButtonClass) ? config.activeButtonClass : "active";
      this.filterItemClass = (config && config.filterItemClass) ? config.filterItemClass : "tf-filter-item";
      this.counterSelector = (config && config.counterSelector) ? config.counterSelector : "selectedItemCount";
      
      this.populateCount = (config && config.populateCount) ? config.populateCount : false;
      this.setDisabledButtonClass = (config && config.setDisabledButtonClass) ? config.setDisabledButtonClass : false;
      
      
      this.filterItems = document.getElementsByClassName(this.filterItemClass);
      this.selectedItemCount = 0;
      
      this.filterValues = {};
      
      for( var i = 0; i < this.FILTERS.length; i++) {
        this.FILTERS[i]['buttonTotal'] = document.getElementsByClassName(this.FILTERS[i]['buttonClass']).length;
        this.FILTERS[i]['selected'] = [];
        this.FILTERS[i]['values'] = [];
        var fv = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);
        
        /**      
        * Build index of all filter values and their counts      
        */       
        this.filterValues[this.FILTERS[i]['name']] = []; 
        for( var j = 0; j < fv.length; j++ ){
          var v = fv[j].id.replace(this.FILTERS[i]["prefix"], '');
          this.filterValues[this.FILTERS[i]['name']][v] = {count:0, selected:0};
        }
      }
      this.showCheck(this.FILTERS[0]['name'], true);
  
  
    }
    
    initFilterCount(fvc, isInitial){
      
      /**    
       * Initialise count = selected
       */     
      if(isInitial) {
        for( var k in fvc ) {
          for( var x = 0; x < this.filterItems.length; x++) {
            var attrs = this.getAttrs(k, this.filterItems[x]);
            for(var l = 0; l <attrs.length; l++) {
              fvc[k][attrs[l]].count++;
              fvc[k][attrs[l]].selected++;
            }
          }
        }
      } else {
        var showing = document.getElementsByClassName(this.showItemClass);
        for( var k in fvc ) {
          for( var k2 in fvc[k] ){
            fvc[k][k2].selected = 0;
          }
        }
        for(var l = 0; l < showing.length; l++) {
          for( k in fvc ){
            var attrs = this.getAttrs(k, showing[l]);
            for(var m = 0; m < attrs.length; m++) {
              fvc[k][attrs[m]].selected++;
            }
          }
        }
      }
  
      return fvc;
    }
    
    populateCounters(fvc){
  
      if(this.populateCount) {
        for( var i = 0; i < this.FILTERS.length; i++) {
          var fname = this.FILTERS[i]['name'];
          var cp = this.FILTERS[i]['countPrefix'];
          var sp = this.FILTERS[i]['selectedPrefix'];
          
          if( cp || sp ) {
            for( var k in fvc[fname] ){
              if(cp) {
                var cel = document.getElementById(`${cp}${k}`)
                    cel.textContent = fvc[fname][k].count;
              }
              if(sp) {
                var sel = document.getElementById(`${sp}${k}`)
                    sel.textContent = fvc[fname][k].selected;
                if(this.setDisabledButtonClass) {
                  if( sel.textContent == 0) {
                    this.addClassIfMissing(document.getElementById(this.FILTERS[i]['prefix']+k), this.setDisabledButtonClass);
                  } else {
                    this.delClassIfPresent(document.getElementById(this.FILTERS[i]['prefix']+k), this.setDisabledButtonClass)
                  }
                }
              }
            }
          }
        }
      }
    }
    
    
    /**  
     * getAttrs - returns an array of data-attr attributes of an element elem
     */   
    getAttrs(attr, elem) {
      return elem.getAttribute('data-'+ attr )
                .split(" ")
                .filter(function(el){
                  return el.length > 0
                });
    }
    
    showAll(filter) {
      for( var i = 0; i < this.FILTERS.length; i++) {
        if(filter) {
          if(this.FILTERS[i]['name'] === filter) {
            this.FILTERS[i]['selected'] = [];
          }
        } else {
          this.FILTERS[i]['selected'] = [];
        }
      }
      this.showCheck(filter)
    }
    
    checkFilter(tag, tagType) {
      
      /* Selects clicked button.*/   
      var selectedBtn = document.querySelector(`#${tagType}${tag}`);
      
      for ( var i = 0; i < this.FILTERS.length; i++ ) {
        if ( this.FILTERS[i]['prefix'] === tagType ) {
          if ( this.FILTERS[i]['selected'].indexOf(tag) >= 0 ) { 
            /* already selected, deselect tag */
            this.FILTERS[i]['selected'].splice(tag,1);
            this.delClassIfPresent(selectedBtn, this.activeButtonClass);
          } else { 
            /* add tag to selected list */
            this.FILTERS[i]['selected'].push(tag);
            this.addClassIfMissing(selectedBtn, this.activeButtonClass);
          } 
          this.delClassIfPresent(document.querySelector(this.FILTERS[i]['allSelector']), this.activeButtonClass);
          this.showCheck(this.FILTERS[i]['name']);
        }
      }
    }
    
    /**
    * showCheck - Applies "show" class to items containing selected tags
    */ 
    showCheck(filter, isInitial) {
    
      /* If no tags/licenses selected, or all tags selected, SHOW ALL and DESELECT ALL BUTTONS. */   
      for ( var i = 0; i < this.FILTERS.length; i++ ) {
        if( this.FILTERS[i]['name'] === filter ) {
          if( (this.FILTERS[i]['selected'].length === 0) || 
              (this.FILTERS[i]['selected'].length === this.FILTERS[i]['buttonTotal']) ) 
          {  
            var iBtns = document.getElementsByClassName(this.FILTERS[i]['buttonClass']);
            for ( var j = 0; j < iBtns.length; j++ ) {
              this.delClassIfPresent(iBtns[j], this.activeButtonClass)
            }
            this.addClassIfMissing(document.querySelector(this.FILTERS[i]['allSelector']), this.activeButtonClass)
          }
        } 
      }
      
      this.selectedItemCount=0;
      
      for ( var i = 0; i < this.filterItems.length; i++ ) {
        /* First remove "show" class */
        this.delClassIfPresent(this.filterItems[i], this.showItemClass);
        
        var visibility = 0;
        /* show item only if visibility is true for all filters */
        for ( var j = 0; j < this.FILTERS.length; j++ ) {
          if ( this.checkVisibility(this.FILTERS[j]['selected'], this.filterItems[i].getAttribute(this.FILTERS[j]['attrName'])) ) {
            visibility++;
          }
        }
        /* Then check if "show" class should be applied */
        if ( visibility === this.FILTERS.length ) {
          if ( !this.filterItems[i].classList.contains(this.showItemClass) ) {
            this.selectedItemCount++;
            this.addClassIfMissing(this.filterItems[i], this.showItemClass);
          }
        }
      }
      
      if(document.getElementById(this.counterSelector)) {
        document.getElementById(this.counterSelector).textContent=`${this.selectedItemCount}`;
      }
      
      this.checkButtonCounts(isInitial)
      
    }
    
    checkButtonCounts(isInitial){
      this.filterValues = this.initFilterCount(this.filterValues, isInitial);
      this.populateCounters(this.filterValues);
  
    }
    
    
    /**
    * checkVisibility - Tests if attribute is included in list.
    */ 
    checkVisibility(list, dataAttr) {
      /* Returns TRUE if list is empty or attribute is in list */   
      if (list.length > 0) {
        for(var v = 0; v < list.length; v++){
          var arr = dataAttr.split(" ")
                            .filter(function(el){return el.length > 0});
          if(arr.indexOf(list[v]) >=0 ) {
            return true
          }
        }
        return false
      } else {
        return true 
      }
    }
    
    addClassIfMissing(el, cn) {
      if(!el.classList.contains(cn)) {
        el.classList.add(cn);
      } 
    }
    
    delClassIfPresent(el, cn) {
      if(el.classList.contains(cn)) {
        el.classList.remove(cn)
      } 
    }
  }
  
  window['HugoTagsFilter'] = HugoTagsFilter;
