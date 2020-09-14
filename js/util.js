agents=['prey','predator']
results=['goal attained','goal not attained', 'all']
fill_colors = ["red", "blue"];
agent_colors = ["green", "orange"];

function getUrlVars() {
    let vars = {};
    let query = window.location.href.split("#")[0].replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getResource(callback, resource_type, key0, key1, key2, key3, key4, key5, key6, key7, key8, key9) {
    let resource_uri = "https://raw.githubusercontent.com/germanespinosa/cellworld_data/master/" + resource_type + "/";
    for (let i=2; i<arguments.length; i++){
        if (i>2) resource_uri+="_";
        resource_uri+=arguments[i];
    }
    loadfile(resource_uri, callback);
}

function getWorldCoordinates(world){
    let min_x = world.cells[0].coordinates.x;
    let min_y = world.cells[0].coordinates.y;
    let max_x = world.cells[0].coordinates.x;
    let max_y = world.cells[0].coordinates.y;
    for (let i=1; i<world.cells.length; i++){
        if (world.cells[i].coordinates.x<min_x) min_x = world.cells[i].coordinates.x;
        if (world.cells[i].coordinates.x<min_y) min_y = world.cells[i].coordinates.y;
        if (world.cells[i].coordinates.x>max_x) max_x = world.cells[i].coordinates.x;
        if (world.cells[i].coordinates.x>max_y) max_y = world.cells[i].coordinates.y;
    }
    return [{"x":min_x,"y":min_y},{"x":max_x,"y":max_y}];
}

function getWorldDimensions(world_coordinates){
    return {"cols": world_coordinates[1].x - world_coordinates[0].x + 1,"rows" : world_coordinates[1].y - world_coordinates[0].y + 1};
}

function getWorld(world_name, callback){
    getResource(function(a) {
        a.coordinates = getWorldCoordinates(a);
        a.dimensions = getWorldDimensions(a.coordinates);
        callback(a);
    },"world", world_name);
}

function getEpisode(experiment, group, world, configuration, episode, step, agent, callback){
    const episode_uri = "https://raw.githubusercontent.com/germanespinosa/cellworld_results/master/experiment_" + experiment + "/group_" + group + "/world_" + world + "/configuration_" + configuration +"/episode_" + episode + ".json";
    loadfile(episode_uri, function(episode) {
        getWorld(episode.world, function (world) {
            episode.world = world;
            episode.step = parseInt(step);
            episode.agent = parseInt(agent);
            callback(episode);
        });
    });
}

parameters = getUrlVars();
results_folder = "https://raw.githubusercontent.com/germanespinosa/results/master/";
project_folder = results_folder + parameters["experiment"] + "/";
img_folder = project_folder + "heatmaps/";

function equal(a,b){
    return JSON.stringify(a) == JSON.stringify(b);
}

function contains(l,i){
    for (let index=0; index<l.length; index ++) if (equal(l[index], i)) return true;
    return false;
}

function round(a){
    return(Math.round(a * 100)/ 100);
}

function loadfile (url, callback) {
    let request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.send(null);
}

Range = function(a,b){
    let r=[];
    if (typeof b == "undefined"){
        for (let i=0;i<a;i++) r.push(i);
    } else {
        for (;a<b;a++) r.push(a);
    }
    return r;
}

function GetUrl(url, experiment, group, world, set){
    let uri = url + "?experiment=" + experiment;
    if (typeof group != "undefined") uri += "&group=" + group;
    if (typeof world != "undefined") uri += "&world=" + world;
    if (typeof set != "undefined") uri += "&set=" + set;
    return uri;
}

function download(data, filename) {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
    hiddenElement.target = '_blank';
    hiddenElement.download = filename;
    hiddenElement.click();
}

function get_item_by_name(list, name){
    for (let i=0 ;i<list.length;i++)
        if (list[i].name == name) return list[i];
}