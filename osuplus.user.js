// ==UserScript==
// @name         osuplus
// @namespace    https://osu.ppy.sh/u/1843447
// @version      1.0.2
// @description  show pp, selected mods ranking, friends ranking and other stuff
// @author       oneplusone
// @include      http*://osu.ppy.sh/b/*
// @include      http*://osu.ppy.sh/s/*
// @include      http*://osu.ppy.sh/p/beatmap?b=*
// @include      http*://osu.ppy.sh/p/beatmap?s=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var apikey = null,
    hasKey = false,
    result = null,
    mapID = null,
    mapsetID = null,
    mapMode = null,
    timeDelay = 1000,
    timeoutID = null,
    songInfoRef = null,
    scoresTableRef = null,
    scoresTableBodyRef = null,
    playerCountries = null,
    modBtns = [],
    localUser = null,
    localScore = null,
    friends = null,
    scoreListing = null,
    scoreListingTitlerow = null;

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
    {val: 32768, name: "Key4", short: "4K"},
    {val: 65536, name: "Key5", short: "5K"},
    {val: 131072, name: "Key6", short: "6K"},
    {val: 262144, name: "Key7", short: "7K"},
    {val: 524288, name: "Key8", short: "8K"},
    {val: 1048576, name: "FadeIn", short: "FI"},
    {val: 2097152, name: "Random", short: "RD"},
    {val: 4194304, name: "LastMod", short: "LM"},
    {val: 16777216, name: "Key9", short: "9K"},
    {val: 33554432, name: "Key10", short: "10K"},
    {val: 67108864, name: "Key1", short: "1K"},
    {val: 134217728, name: "Key3", short: "3K"},
    {val: 268435456, name: "Key2", short: "2K"},
],
    // if the first is set, the second has to be set also
    doublemods = [
        ["NC", "DT"],
        ["PF", "SD"]
    ];


$(document).ready(function(){
    init();
    p(mapID);
    p(mapsetID);
    p(mapMode);
});

function init(){
    apikey = GM_getValue("apikey", null);
    if(apikey !== null){
        hasKey = true;
    }else{
        hasKey = false;
        displayGetKey();
    }
    songInfoRef = $("#songinfo");
    scoresTableRef = $(".beatmapListing").children();
    scoresTableBodyRef = scoresTableRef.children();
    var osuLink = songInfoRef.children().children().last().children().eq(2).children().eq(3).attr("href").split("/");
    mapID = osuLink[osuLink.length - 1];
    var mapsetIDLink = $(".beatmap_download_link").last().attr("href").split("/");
    mapsetID = mapsetIDLink[mapsetIDLink.length - 1];
    mapMode = getMapmode();
    playerCountries = GM_getValue("playerCountries", {});
    if(typeof localUserId !== "undefined"){
        localUser = localUserId;
    }
    scoreListing = $(".beatmapListing");
    scoreListingTitlerow = $(".titlerow");
    addBloodcatMirror();
    showMapValues();
    friends = GM_getValue("friends", []);
    getFriends(function(response){
        friends = response;
        GM_setValue("friends", friends);
    });
    
    if(hasKey){
        putModButtons();
        putRankingType();
        getScores({b:mapID, m:mapMode, limit:100}, function(response){
            result = response;
            addScoreLeaderpp();
            addPPColHeader();
            updateScoresTable();
            addSearchUser();
        });
    }
}

function addSearchUser(){
    $(".content-with-bg").children("h2").before(
        $("<div></div>").attr("id", "searchuser")
        .append(
            $("<strong>Search user:</strong>"),
            $("<input>").attr({type: "text",
                               id: "searchusertxt"})
            .bind("enterKey", searchUserEnter)
            .keyup(function(e){
                if(e.keyCode == 13)
                {
                    $(this).trigger("enterKey");
                }
            }),
            $("<div></div>").attr("id", "searchuserinfo").text("Searching...").hide(),
            $("<div></div>").attr("class","beatmapListing")
            .attr("id", "searchuserresult")
            .append(
                $("<table width=100% cellspacing=0></table>").append("<tbody></tbody>").append(
                    scoreListingTitlerow.clone()
                )/*
                $("<table width=100% cellspacing=0>" +
                  "<tbody><tr class=\"titlerow\"><th></th>" + 
                  "<th><strong>Rank</strong></th>" +
                  "<th><strong>Score</strong></th>" +
                  "<th><strong>pp</strong></th>" +
                  "<th><strong>Accuracy</strong></th>" +
                  "<th><strong>Player</strong></th>" +
                  "<th><strong>Max Combo</strong></th>" +
                  "<th><strong>300 / 100 / 50</strong></th>" +
                  "<th><strong>Geki</strong></th>" +
                  "<th><strong>Katu</strong></th>" +
                  "<th><strong>Misses</strong></th>" +
                  "<th><strong>Mods</strong></th><th></th></tr></tbody></table>")*/
            ).hide()
        )
    );
}

function searchUserEnter(){
    $("#searchuserinfo").text("Searching").show();
    $("#searchuserresult").hide();
    var searchusername = $("#searchusertxt").val();
    getScores({b:mapID, u:searchusername, m:mapMode, type:"string"}, function(response){
        if(response && response.length > 0){
            var searchResult = response[0];
            $("#searchuserresult").find(".titlerow").nextAll().remove();
            $("#searchuserresult").find(".titlerow").parent().children().last().after(makeScoreTableRow(searchResult, 0));
            $("#searchuserinfo").hide();
            $("#searchuserresult").show();
        }else{
            $("#searchuserinfo").text("No scores found :(");
        }
    });
}

function putRankingType(){
    $(".content-with-bg").children("h2").after(
        $("<div></div>").attr("id", "rankingtype").append(
            $("<label></label>").append($("<input>").attr({type: "radio",
                                                           name: "rankingtype",
                                                           value: "global"})
                                        .prop("checked", true)
                                        .change(rankingTypeChanged),
                                        "Global"),
            $("<label></label>").append($("<input>").attr({type: "radio",
                                                           name: "rankingtype",
                                                           value: "friends"})
                                        .change(rankingTypeChanged),
                                        "Friends")
        )
    );
}

function rankingTypeChanged(){
    var rankingType = $("input[name=rankingtype]:checked").val();
    function enableModBtns(yesno){
        for(var i=0; i<modBtns.length; i++){
            modBtns[i].prop("disabled", !yesno);
        }
    }
    if(rankingType == "global"){
        enableModBtns(true);
        if(timeoutID !== null) clearTimeout(timeoutID);
        updateModScores();
    }else if(rankingType == "friends"){
        enableModBtns(false);
        if(timeoutID !== null) clearTimeout(timeoutID);
        updateFriendsScores();
    }
}

function updateFriendsScores(){
    var funs = [];
    for(var i=0; i<friends.length+1; i++){
        funs.push(function(uid){
            return function(callback){
                getScores({b:mapID, u:uid, m:mapMode, type:"id"}, function(response){
                    if(response.length > 0){
                        result.push(response[0]);
                    }
                    callback();
                });
            };
        }(i<friends.length ? friends[i] : localUser));
    }
    result = [];
    doManyFunc(funs, function(){
        sortResult();
        updateScoresTable();
    });
}

function sortResult(){
    result.sort(function(a,b){
        return parseInt(b.score) - parseInt(a.score);
    });
}

function doManyFunc(funs, finalcallback){
    var done = 0, total = funs.length;
    for(var i=0; i<total; i++){
        funs[i](function(){
            done++;
            if(done == total){
                finalcallback();
            }
        });
    }
    if(total === 0){
        finalcallback();
    }
}

function getFriends(callback){
    GetPage("https://osu.ppy.sh/p/friends", function(response){
        var friends = [];
        response = response.replace(/<img[^>]*>/g,"");
        $(response).find(".paddingboth").children("div").each(function(ind, ele){
            friends.push($(ele).attr("user_id"));
        });
        callback(friends);
    });
}

function isFriend(uid){
    for(var i=0; i<friends.length; i++){
        if(friends[i] == uid) return true;
    }
    return false;
}

function addScoreLeaderpp(){
    var scoreLeaders = $(".scoreLeader");
    if(scoreLeaders.length > 0) updateScoreLeaderpp(scoreLeaders.first(), result[0]);
    if(scoreLeaders.length > 1){
        getScores({b:mapID, u:localUser, m:mapMode, type:"id"}, function(response){
            if(response.length > 0){
                localScore = response[0];
                updateScoreLeaderpp(scoreLeaders.eq(1), localScore);
            }
        });
    }
}

function updateScoreLeaderpp(scoreLeader, score){
    var rows = scoreLeader.children().children();
    var numrows = rows.length;
    rows.eq(1).children().last().attr("rowspan", numrows);
    var rowclass = "row" + ((numrows+1)%2+1) + "p";
    scoreLeader.children().append($("<tr></tr>").attr("class", rowclass)
                                  .append($("<td><strong>pp</strong></td>"))
                                  .append($("<td></td>").text(parseFloat(score.pp).toFixed(2)))
                                 );
}

function displayGetKey(){
    $(document.body).prepend($("<div style='text-align: center; color: white'></div>")
                             .attr("id", "osuplusnotice")
                             .append("[osuplus] Click ",
                                     $("<a>here</a>").click(promptKey),
                                     " to use your osu!API key"
                                    ));
}

function promptKey(){
    var yourKey = prompt("Enter your API key");
    if(yourKey !== null){
        testKey(yourKey, function(islegit){
            if(islegit){
                GM_setValue("apikey", yourKey);
                apikey = yourKey;
                hasKey = true;
                alert("API key worked! Your page will now refresh");
                location.reload();
            }else{
                alert("API key failed :(");
            }
        });
    }
}

function testKey(key, callback){
    var url = "https://osu.ppy.sh/api/get_user?k=" + key;
    GetPage(url, function(response){
        var jresponse = JSON.parse(response);
        if("error" in jresponse){
            callback(false);
        }else{
            callback(true);
        }
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
        $(".beatmap_download_link").last().after("<br>",$("<a></a>").text("Bloodcat mirror").attr("href", "http://bloodcat.com/osu/s/" + mapsetID))
    }
}

function putModButtons(){
    var cbcounter = 0;
    function genCheckbox(value, lbltxt){
        var btn = $("<input>").attr({type:"checkbox",
                                     value:value})
                              .change(timeoutUpdate);
        modBtns.push(btn);
        return $("<label></label>").append(btn, lbltxt);
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
    timeoutID = setTimeout(function(){
        timeoutID = null;
        updateModScores();
    }, timeDelay);
}

function updateModScores(){
    var modval = getSelectedMods();
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
    scoreListingTitlerow.children().eq(2).after("<th><strong>pp</strong></th>");
}

function addPPCol(){
    addPPColHeader();
    scoreListingTitlerow.nextAll().each(function(ind,ele){$(ele).children().eq(2).after("<td>" + result[ind].pp + "</td>");});
}

function updateScoresTable(){
    scoreListingTitlerow.nextAll().remove();
    for(var i=0; i<result.length; i++){
        scoreListingTitlerow.parent().children().last().after(makeScoreTableRow(result[i], i+1));
    }
}

function makeScoreTableRow(score, rankno){
    var acc = calcAcc(score);
    var rowclass;
    if(localUser !== null && localUser.toString() === score.user_id){
        rowclass = "row3p";
    }else if(isFriend(score.user_id)){
        rowclass = "row4p";
    }else{
        rowclass = "row" + ((rankno+1)%2 + 1) + "p";
    }
    return $("<tr></tr>")
        .attr("class", rowclass)
        .attr("title", score.date)
        .append(
        $("<td></td>").text(rankno>0 ? "#" + rankno : ""),
        $("<td></td>").append(getRankImg(score.rank)),
        $("<td></td>").html(rankno===1 ? "<b>"+commarise(score.score)+"</b>" : commarise(score.score)),
        $("<td></td>").text(parseFloat(score.pp).toFixed(2)),
        $("<td></td>").html(acc==100 ? "<b>"+acc.toFixed(2) + "%</b>" : acc.toFixed(2) + "%"),
        $("<td></td>").append(function(playerid, img){
            img.attr("class", "flag");
            getPlayerCountry(playerid, function(country){
                img.attr("src", getCountryUrl(country));
            });
            return img;
        }(score.user_id, $("<img></img>")),
                              "\n",
                              $("<a></a>")
                              .attr("href", "/u/"+score.user_id)
                              .text(score.username)),
        $("<td></td>").text(score.maxcombo),
        mapMode === 3 ? 
        // Mania
        [$("<td></td>").text(score.countgeki),
         $("<td></td>").text(score.count300),
         $("<td></td>").text(score.countkatu),
         $("<td></td>").text(score.count100),
         $("<td></td>").text(score.count50)] : 
        // Standard/Taiko/CTB
        [$("<td></td>").html(score.count300 + "&nbsp;&nbsp;/&nbsp;&nbsp;" + 
                             score.count100 + "&nbsp;&nbsp;/&nbsp;&nbsp;" +
                             score.count50),
         $("<td></td>").text(score.countgeki),
         $("<td></td>").text(score.countkatu)],
        $("<td></td>").text(score.countmiss),
        $("<td></td>").text(getMods(score.enabled_mods)),
        $("<td></td>").append($("<a></a>")
                              .attr("onclick", "reportscore("+score.score_id+");")
                              .text("Report"))
    );
}

function calcAcc(score){
    var c50   = parseInt(score.count50),
        c100  = parseInt(score.count100),
        c300  = parseInt(score.count300),
        cmiss = parseInt(score.countmiss),
        cgeki = parseInt(score.countgeki),
        ckatu = parseInt(score.countkatu);
    if(mapMode === 0 || mapMode === 1){
        // Standard/Taiko
        return 100.0 * (6*c300 + 2*c100 + c50) / (6*(c50 + c100 + c300 + cmiss));
    }else if(mapMode === 2){
        //CTB
        return 100.0 * (c300 + c100 + c50) / (c300 + c100 + c50 + ckatu + cmiss);
    }else{
        //Mania
        return 100.0 * (6*cgeki + 6*c300 + 4*ckatu + 2*c100 + c50) / (6*(c50 + c100 + c300 + cmiss + cgeki + ckatu));
    }
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
            var country = response[0].country.toLowerCase();
            savePlayerCountry(playerid, country);
            callback(country);
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

function getReplay(params, callback){
    /*
    k - api key (required).
    m - the mode the score was played in (required).
    b - the beatmap ID (not beatmap set ID!) in which the replay was played (required).
    u - the user that has played the beatmap (required).
    */
    var url = "https://osu.ppy.sh/api/get_replay";
    params.k = apikey;
    persistGetPage(getUrl(url, params), function(response){
        callback(JSON.parse(response));
    });
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
    persistGetPage(getUrl(url, params), function(response){
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
    persistGetPage(getUrl(url, params), function(response){
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

function persistGetPage(url, callback){
    GetPage(url, function(response){
        if(response === null){
            persistGetPage(url, callback);
        }else{
            callback(response);
        }
    });
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
