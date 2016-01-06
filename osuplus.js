// ==UserScript==
// @name         Moresu
// @namespace    whatever
// @version      0.1
// @description  show pp, selected mods and other stuff
// @author       oneplusone
// @include      http*//osu.ppy.sh/b/*
// @include      http*//osu.ppy.sh/s/*
// @include      http*://osu.ppy.sh/p/beatmap?b=*
// @include      http*://osu.ppy.sh/p/beatmap?s=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// pls insert your own apikey here
var apikey = "your key here";

var result = null,
    mapID = null,
    mapsetID = null,
    mapMode = null,
    timeDelay = 1000,
    timeoutID = null,
    requestedUpdate = false,
    updateInProgress = true,
    songInfoRef = null,
    scoresTableRef = null,
    scoresTableBodyRef = null,
    playerCountries = null,
    modBtns = [],
    localUser = null;

var modnames = [
    {val: 1, name: "NoFail", short: "NF"},
    {val: 2, name: "Easy", short: "EZ"},
    {val: 4, name: "NoVideo", short: ""},
    {val: 8, name: "Hidden", short: "HD"},
    {val: 16, name: "HardRock", short: "HR"},
    {val: 32, name: "SuddenDeath", short: "SD"},
    {val: 64, name: "DoubleTime", short: "DT"},
    {val: 128, name: "Relax", short: "RX"},
    {val: 256, name: "HalfTime", short: "HT"},
    {val: 512, name: "Nightcore", short: "NC"},
    {val: 1024, name: "Flashlight", short: "FL"},
    {val: 2048, name: "Autoplay", short: "AT"},
    {val: 4096, name: "SpunOut", short: "SO"},
    {val: 8192, name: "Relax2", short: "AP"},
    {val: 16384, name: "Perfect", short: "PF"},
    {val: 32768, name: "Key4", short: "K4"},
    {val: 65536, name: "Key5", short: "K5"},
    {val: 131072, name: "Key6", short: "K6"},
    {val: 262144, name: "Key7", short: "K7"},
    {val: 524288, name: "Key8", short: "K8"},
    {val: 1048576, name: "FadeIn", short: "FI"},
    {val: 2097152, name: "Random", short: "RD"},
    {val: 4194304, name: "LastMod", short: "LM"},
    {val: 16777216, name: "Key9", short: "K9"},
    {val: 33554432, name: "Key10", short: "K10"},
    {val: 67108864, name: "Key1", short: "K1"},
    {val: 134217728, name: "Key3", short: "K3"},
    {val: 268435456, name: "Key2", short: "K2"},
],
    // if the first is set, the second has to be set also
    doublemods = [
        ["NC", "DT"],
        ["PF", "SD"]
    ];



$(document).ready(function(){
    p("hi");
    init();
    p(mapID);
    p(mapsetID);
    p(mapMode);
    //playerCountries = GM_getValue("playerCountries", {});
    //p(playerCountries);
    //getPlayerCountry(264923, p);
});

function init(){
    
    songInfoRef = $("#songinfo")[0];
    scoresTableRef = $(".beatmapListing")[0].children[0];
    scoresTableBodyRef = scoresTableRef.children[0];
    var songInfoLen = songInfoRef.children[0].children.length;
    var osuLink = songInfoRef.children[0].children[songInfoLen-1].children[2].children[3].href.split("/");
    mapID = osuLink[osuLink.length - 1];
    var mapsetIDLink = $(".beatmap_download_link")[0].href.split("/");
    mapsetID = mapsetIDLink[mapsetIDLink.length - 1];
    mapMode = getMapmode();
    playerCountries = GM_getValue("playerCountries", {});
    if(typeof localUserId !== "undefined"){
        localUser = localUserId;
    }
    addBloodcatMirror();
    showMapValues();
    putModButtons();
    
    getScores({b:mapID, m:mapMode, limit:100}, function(response){
        result = response;
        //p(result);
        addPPColHeader();
        updateScoresTable();
    });
}

function showMapValues(){
    var basewidth = 140;
    var csele = $("#songinfo").children().children().eq(0).children().eq(3).children(),
        arele = $("#songinfo").children().children().eq(0).children().eq(5).children(),
        hpele = $("#songinfo").children().children().eq(1).children().eq(3).children(),
        odele = $("#songinfo").children().children().eq(2).children().eq(3).children();
    var csval = 10 * csele.children().width() / basewidth,
        arval = 10 * arele.children().width() / basewidth,
        hpval = 10 * hpele.children().width() / basewidth,
        odval = 10 * odele.children().width() / basewidth;
    csele.after("\n(" + csval.toFixed(1) + ")");
    arele.after("\n(" + arval.toFixed(1) + ")");
    hpele.after("\n(" + hpval.toFixed(1) + ")");
    odele.after("\n(" + odval.toFixed(1) + ")");
}

function addBloodcatMirror(){
    if(mapsetID !== null){
        $(".beatmap_download_link").after("<br>",$("<a></a>").text("Bloodcat mirror").attr("href", "http://bloodcat.com/osu/s/" + mapsetID))
    }
}

function putModButtons(){
    var cbcounter = 0;
    function genCheckbox(value, lbltxt){
        var id = "cb" + cbcounter;
        cbcounter++;
        var btn = $("<input>").attr({id:id, 
                                     type:"checkbox",
                                     value:value})
                              .change(timeoutUpdate);
        modBtns.push(btn);
        return [
            btn,
            $("<label></label>").attr("for", id).text(lbltxt)
        ];
    }
    $(".content-with-bg").find("h2").next().empty().append(
        genCheckbox("NM", "NoMod"),
        genCheckbox("HD", "Hidden"),
        genCheckbox("HR", "HardRock"),
        genCheckbox("DT", "DoubleTime"),
        genCheckbox("NC", "Nightcore"),
        genCheckbox("SD", "SuddenDeath"),
        genCheckbox("PF", "Perfect"),
        genCheckbox("FL", "Flashlight"),
        genCheckbox("NF", "NoFail"),
        genCheckbox("HT", "HalfTime"),
        genCheckbox("EZ", "Easy"),
        genCheckbox("SO", "SpunOut")
    );
}

function timeoutUpdate(){
    if(timeoutID != null){
        clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(function(modval){
        timeoutID = null;
        if(modval < 0){
            getScores({b:mapID, m:mapMode, limit:100}, function(response){
                result = response;
                updateScoresTable();
            });
        }else{
            getScores({b:mapID, m:mapMode, limit:100, mods:modval}, function(response){
                result = response;
                updateScoresTable();
            });
        }
    }, timeDelay, getSelectedMods());
}

function getSelectedMods(){
    var selected = [];
    for(var i=0; i<modBtns.length; i++){
        if(modBtns[i].is(":checked")){
            selected.push(modBtns[i].attr("value"));
        }
    }
    // handle doublemods
    for(var i=0; i<doublemods.length; i++){
        if(selected.indexOf(doublemods[i][0]) >= 0){
            if(selected.indexOf(doublemods[i][1]) < 0){
                selected.push(doublemods[i][1]);
            }
        }
    }
    
    var modval = 0;
    if(selected.length == 0){
        modval = -1;
    }else{
        for(var i=0; i<modnames.length; i++){
            if(selected.indexOf(modnames[i].short) >= 0){
                modval += modnames[i].val;
            }
        }
    }
    return modval;
}

function getMapmode(){
    var ls = $(".paddingboth").first().next().children().children();
    var mapmode = 0;
    for(var i=1; i<ls.length; i++){
        if(ls[i].children[0].className == "active")
            mapmode = i;
    }
    return mapmode;
}

function addPPColHeader(){
    $(".titlerow").children().eq(2).after("<th><strong>pp</strong></th>");
}

function addPPCol(){
    addPPColHeader();
    $(".titlerow").nextAll().each(function(ind,ele){$(ele).children().eq(2).after("<td>" + result[ind].pp + "</td>");});
}

function updateScoresTable(){
    $(".titlerow").nextAll().remove();
    var maxscore
    for(var i=0; i<result.length; i++){
        var acc = calcAcc(result[i]);
        var rowclass;
        if(localUser !== null && localUser.toString() === result[i].user_id){
            rowclass = "row3p";
        }else{
            rowclass = "row" + (i%2 + 1) + "p";
        }
        $(".titlerow").parent().children().last().after(
            $("<tr></tr>")
            .attr("class", rowclass)
            .attr("title", result[i].date)
            .append($("<td></td>").text("#" + (i+1)),
                    $("<td></td>").append(getRankImg(result[i].rank)),
                    $("<td></td>").html(i==0 ? "<b>"+commarise(result[i].score)+"</b>" : commarise(result[i].score)),
                    $("<td></td>").text(Math.round(result[i].pp)),
                    $("<td></td>").html(acc==100 ? "<b>"+acc.toFixed(2) + "%</b>" : acc.toFixed(2) + "%"),
                    $("<td></td>").append(function(playerid, img){
                                              img.attr("class", "flag");
                                              getPlayerCountry(playerid, function(country){
                                                  img.attr("src", getCountryUrl(country));
                                              });
                                              return img;
                                          }(result[i].user_id, $("<img></img>")),
                                          "\n",
                                          $("<a></a>")
                                          .attr("href", "/u/"+result[i].user_id)
                                          .text(result[i].username)),
                    $("<td></td>").text(result[i].maxcombo),
                    $("<td></td>").html(result[i].count300 + "&nbsp;&nbsp;/&nbsp;&nbsp;" + 
                                        result[i].count100 + "&nbsp;&nbsp;/&nbsp;&nbsp;" +
                                        result[i].count50),
                    $("<td></td>").text(result[i].countgeki),
                    $("<td></td>").text(result[i].countkatu),
                    $("<td></td>").text(result[i].countmiss),
                    $("<td></td>").text(getMods(result[i].enabled_mods)),
                    $("<td></td>").append($("<a></a>")
                                          .attr("onclick", "reportscore("+result[i].user_id+");")
                                          .text("Report"))
                   )
        );
    }
}

function calcAcc(score){
    var c50   = parseInt(score.count50),
        c100  = parseInt(score.count100),
        c300  = parseInt(score.count300),
        cmiss = parseInt(score.countmiss);
    return 100.0 * (6*c300 + 2*c100 + c50) / (6*(c50+c100+c300+cmiss));
}

function getMods(modnum){
    modnum = parseInt(modnum);
    var mods = [];
    for(var i=modnames.length-1; i>=0; i--){
        if(modnames[i].val <= modnum){
            if(modnames[i].short != ""){
                mods.push(modnames[i].short);
            }
            modnum -= modnames[i].val;
        }
    }
    // handle doublemods
    for(var i=0; i<doublemods.length; i++){
        if(mods.indexOf(doublemods[i][0]) >= 0){
            mods.splice(mods.indexOf(doublemods[i][1]), 1);
        }
    }
    if(mods.length == 0) return "None";
    else return mods.reverse().join(",");
}

function getPlayerCountry(playerid, callback){
    if(playerid in playerCountries){
        callback(playerCountries[playerid]);
    }else{
        function responseFun(response){
            if(response == null){
                getUser({u:playerid, type:"id"}, responseFun);
            }else{
                var country = response[0].country.toLowerCase();
                savePlayerCountry(playerid, country);
                callback(country);
            }
        }
        getUser({u:playerid, type:"id"}, responseFun);
    }
}

function savePlayerCountry(playerid, country){
    playerCountries[playerid] = country;
    GM_setValue("playerCountries", playerCountries);
}

function getCountryUrl(country){
    return "//s.ppy.sh/images/flags/" + country + ".gif";
}
                
function commarise(num){
    num = num.toString();
    var numarray = [];
    while(num !== ""){
        numarray.push(num.slice(-3));
        num = num.slice(0,-3);
    }
    return numarray.reverse().join(",");
}

function getRankImg(rank){
    var newimg = $("<img></img>").attr("src", "/images/"+rank+"_small.png");
    return newimg;
}

function getScores(params, callback){
    /*
    k - api key (required).
    b - specify a beatmap_id to return score information from (required).
    u - specify a user_id or a username to return score information for.
    m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0.
    mods - specify a mod or mod combination (See the bitwise enum)
    type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behaviour is automatic recognition (may be problematic for usernames made up of digits only).
    limit - amount of results from the top (range between 1 and 100 - defaults to 50).
    */
    var url = "https://osu.ppy.sh/api/get_scores";
    params.k = apikey;
    GetPage(getUrl(url, params), function(response){
        callback(JSON.parse(response));
    });
}

function getUser(params, callback){
    /*
    k - api key (required).
    u - specify a user_id or a username to return metadata from (required).
    m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0.
    type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behaviour is automatic recognition (may be problematic for usernames made up of digits only).
    event_days - Max number of days between now and last event date. Range of 1-31. Optional, default value is 1.
    */
    var url = "https://osu.ppy.sh/api/get_user";
    params.k = apikey;
    GetPage(getUrl(url, params), function(response){
        callback(JSON.parse(response));
    });
}

function getUrl(url, params){
    if(params){
        var paramarray = [];
        for(k in params){
            paramarray.push(k + "=" + encodeURIComponent(params[k]));
        }
        return url + "?" + paramarray.join("&");
    }else{
        return url;
    }
}

function GetPage(url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        synchronous: true,
        timeout: 4000,
        headers: {
            Referer: location.href
        },
        onload: function (resp) {
            callback(resp.responseText);
        },
        ontimeout: function () {
            callback(null);
        }
    });
}

function p(s){
    console.log(s);
}
