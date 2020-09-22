function Map (
        episode,
        dimensions = { width : 800, height : 800} ) {
    let colors = ["blue", "purple"];
    let agent_count = episode.trajectories[0].length;
    let agent_locations = [];
    for (let a = 0 ; a < agent_count; a++){
        agent_locations.push(episode.trajectories[episode.step + (a < episode.agent?1:0)][a]);
    }
    let max = 0 ;
    for (let c = 0 ; c < episode.world.cells.length ; c ++){
        let counter = 0;
        for (let t = 0 ; t < episode.step ; t ++){
            if (equal(episode.trajectories[t][1], episode.world.cells[c].coordinates )){
                counter ++;
            }
        }
        episode.world.cells[c].counter = counter;
        if ( counter > max ) max = counter;
    }
    let cols = episode.world.dimensions.cols;
    let rows = episode.world.dimensions.rows;
    let origin = episode.world.coordinates[0];
    let cell_dimensions = { "width": dimensions.width / cols , "height": dimensions.height / rows };
    this.agent_count = agent_count;
    this.dimensions = dimensions
    this.episode = episode;
    this.world = episode.world;
    this.row = function (cell) {
        return cell.coordinates.x;
    };
    this.label = function(cell) {
      return cell.counter;
    };
    this.col = function(cell) {
        return cell.coordinates.y;
    };
    this.x = function (cell) {
        return dimensions.width / cols * (cell.coordinates.x - origin.x);
    };
    this.y = function(cell) {
        return dimensions.height / rows * (cell.coordinates.y - origin.y);
    };
    this.label_x = function (cell) {
        return dimensions.width / cols * (cell.coordinates.x - origin.x) + cell_dimensions.width / 2;
    };
    this.label_y = function(cell) {
        return dimensions.height / rows * (cell.coordinates.y - origin.y) + cell_dimensions.height / 2;
    };
    this.shape =  function (cell) {
        if (cell.cell_type == 0) return "circle";
        if (cell.cell_type == 1) return "rect";
    };
    this.fillColor = function (cell) {
        for ( let a = 0; a < agent_count; a++ ){
            if ( equal(cell.coordinates, agent_locations[a]) ) {
                return colors[a];
            }
        }
        if (cell.occluded) return "black";
        if ( equal(cell.coordinates, episode.goal) ) {
            return "green";
        }
        return "white";
    };
    this.cell_dimensions = cell_dimensions;
}

function render(map, DOMdiv) {
    let div = d3.select(DOMdiv);
    div.innerHTML = "";
    let svg = div.append("svg")
        .style("position","absolute")
        .style("top","0px")
        .style("left","0px")
        .attr("class","heat_map_")
        .attr("width", map.dimensions.width)
        .attr("height", map.dimensions.height)
        .append("g");


    svg.selectAll()
        .data(map.world.cells)
        .enter()
        .append("rect")
        .attr("x", map.x)
        .attr("y", map.y)
        .attr("width", map.cell_dimensions.width)
        .attr("height", map.cell_dimensions.height)
        .style("fill", map.fillColor )
        .style("stroke", "grey")
        .style("stroke-width", .5)
    ;
    svg.selectAll()
        .data(map.world.cells)
        .enter()
        .append("text")
        .attr("x", map.label_x)
        .attr("y", map.label_y)
        .attr("width", map.cell_dimensions.width)
        .attr("height", map.cell_dimensions.height)
        .text(map.label)
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
    ;
}
