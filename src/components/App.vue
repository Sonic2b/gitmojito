<template>
    <div class="ui container">
        <div class="top-section">
            <form @submit.prevent="copyEmojie()" class="ui form">
                <div class="field">
                    <input type="text" id="search" v-model="textInput">
                </div>
            </form>
        </div>            
            <div class="result ui relaxed divided list">
                <div v-for="g in emolist" class="item " :key="g.name">
                    <i class="large middle aligned icon">
                        {{g.emoji}}
                    </i>
                    <div class="content">
                        <a class="header" @click="copyEmojie(g)">{{g.name}}</a>
                        <div class="description white">{{g.description}}</div>
                    </div>
                    <div class="bottom_separator"></div>
                </div>
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

<style lang="scss" scoped>
    .hello {
        padding-top: 75px;
    }
    
    .bottom_separator {
        border-bottom: 1px rgba(255,255,255,0.3) solid !important; 
        width: 105vw;
        position: relative;
        left: -15px;
        margin-top: 5px;
        
    }
    
    #search {
        width: 94%;
        height: 30px;
        border-radius: 5px;
        background: rgba(255,255,255,0.3);
        color: #FFF !important;
    }
    
    .top-section {
        position: fixed;
        width: 95%;
    }
    
    .result {
        top: 30px;
        position: absolute;
        overflow: auto;
        height: 90%;
    }
</style>
