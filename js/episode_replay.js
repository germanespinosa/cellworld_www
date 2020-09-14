function Map(episode, div, step = 0, agent = 0) {
    let colors = ["red", "blue"];
    let agent_count = episode.trajectories[0].length;
    let agent_locations = [];
    for (let a =0 ; a < agent_count; a++){
        agent_locations.push(episode.trajectories[step][a]);
    }
    let cols = episode.world.dimensions.cols;
    let rows = episode.world.dimensions.rows;
    let width = 800;
    let height = 800;
    let origin = episode.world.coordinates[0];
    this.episode = episode;
    this.world = episode.world;
    this.row = function (cell) {
        return cell.coordinates.x;
    };
    this.col = function(cell) {
        return cell.coordinates.y;
    };
    this.x = function (cell) {
        return width / cols * (cell.coordinates.x - origin.x);
    };
    this.y = function(cell) {
        return height / rows * (cell.coordinates.y - origin.y);
    };
    this.shape =  function (cell) {
        if (cell.cell_type == 0) return "circle";
        if (cell.cell_type == 1) return "rect";
    };
    this.fillColor = function (cell) {
        if (cell.occluded) return "black";
        for ( let a = 0; a < agent_count; a++ ){
            if ( equal(cell.coordinates, agent_locations[a]) ) {
                return colors[a];
            }
        }
        return "white";
    };
    this.cell_dimensions = { "width": width / cols , "height": height / rows };
}

function render(map, DOMdiv) {
    let width = DOMdiv.width;
    let height = DOMdiv.height;
    let div = d3.select(DOMdiv);
    div.innerHTML = "";
    let svg = div.append("svg")
        .style("position","absolute")
        .style("top","0px")
        .style("left","0px")
        .attr("class","heat_map_")
        .attr("width", 800)
        .attr("height", 800)
        .append("g");


    svg.selectAll()
        .data(map.episode.world.cells)
        .enter()
        .append("rect")
        .attr("x", map.x)
        .attr("y", map.y)
        .attr("width", map.cell_dimensions.width)
        .attr("height", map.cell_dimensions.height)
        .style("fill", map.fillColor )
        .style("stroke", "grey")
        .style("stroke-width", .5);


}
