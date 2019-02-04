<template>
    <div class="main">
        <div class="top_section">
            <form @submit.prevent="copyEmojie()">
                <div class="top_form">
                    <input type="text" class="search" v-model="textInput">
                    <a class="pref" href="#" @click.prevent="">⚙️</a>
                </div>
            </form>
        </div>            
            <div v-if="textInput.length > 0" class="result">
                <div v-for="(g, index) in emolist" class="item " :key="g.name">
                    
                    <div v-if="index === 0 " class="first_result">
                        <i class="icon">
                            {{g.emoji}}
                        </i>
                        <div class="text">
                             <h1><a href="#" @click.prevent="copyEmojie(g)"> {{g.name}} </a></h1>
                            <h2>{{g.description}}</h2>
                        </div>    
                    </div>
                    
                    
                    <div v-if="index > 0" class="rest_result">
                        <i class="icon">
                            {{g.emoji}}
                        </i>
                        <div class="text">
                            <h1><a href="#" @click.prevent="copyEmojie(g)"> {{g.name}} </a></h1>
                            <h2>{{g.description}}</h2>
                        </div>    
                    </div>

                </div>
            </div>
            <div class="empty" v-else>
                <h1>Search a gitmojie</h1>
            </div>
        <div>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'
// @ts-ignore
import * as matchSorter from 'match-sorter'

@Component
export default class MainViews extends Vue {

    gitmojieList = []
    textInput = ""

    beforeMount() {
        this.loadGitJSON()
    }

    copyEmojie(g = undefined) {
        ipcRenderer.send('copy', g !== undefined ? g : this.emolist[0])
        this.textInput = ''
    }

    get emolist() {
        // return this.gitmojieList.filter(e => e.name.includes(this.textInput))
       return matchSorter(this.gitmojieList, this.textInput, {keys: ['name', 'description']})
    }

    loadGitJSON() {
        fetch("https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json")
        .then(response => response.json())
        .then(res => this.gitmojieList = res.gitmojis)
        .catch(err => {
            ipcRenderer.send('fetch-error', err)
        })
    }

}
</script>

<style scoped>
   .main {
       display: flex;
       flex-direction: column;
       margin: 0% 8% 0% 8%;
   }
   
   .top_section {
        width: 100%;   
   }
   
   .top_form {
       display: flex;
       flex-direction: row;
       justify-content: space-between;
       align-items: center;
   }
   
    .search {
        width: 85%;
        height: 40px;
        font-size: 30px;
        color: #707070;
        border: none;
        border-bottom: 1px solid grey;
    }
    
    .search:focus {
        border-bottom: 1px solid #111;
        outline-color: transparent;
        outline-style: none;
    }
       
    .pref {
        width: 5%;
        text-decoration: none;
        font-size: 27px;
        top: 9px;
        position: relative;
    }
    .empty {
        margin-top: 5%;
        text-align: center;
    }
    
    /**
        RESULT STYLE
    ***/
    
    .result {
        
    }
    
    .first_result {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 105px;
        margin-top: 5%;
    }
    
    .first_result > .icon {
        font-size: 67px;
        margin-right: 5%;
    }
    
    .text {
        display: flex;
        flex-direction: column;
    }
    
    .first_result > .text > h1 {
        margin-bottom: 5px;
    }
    
    .first_result > .text > h2 {
        font-size: 20px;
        color: #707070;
        margin-top: 0px;
    }
    
    .first_result > .text > h1 > a {
        text-decoration: none;
        color: #707070;
    }
    
    
      .rest_result {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100px;
    }
    
    .rest_result > .icon {
        font-size: 49px;
        margin-right: 5%;
    }
    
    .rest_result > .text > h1 {
        margin-bottom: 5px;
        margin-top: 0px;
    }
    
    .rest_result > .text > h2 {
        font-size: 14px;
        color: #707070;
        margin-top: 0px;
    }
    
    .rest_result > .text > h1 > a {
        font-size: 22px;
        text-decoration: none;
        color: #707070;
    }

</style>
