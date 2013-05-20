L.TileLayer.Vector.Debug = L.TileLayer.Vector.extend({
    
    _requestCount: 0,

    onAdd: function (map) {
        L.TileLayer.Vector.prototype.onAdd.apply(this, arguments);
        this.on('tilerequest', this._onTileRequest, this);
        this.on('tileresponse', this._onTileResponse, this);
        this.on('tileload', this._onTileLoad, this);
    },

    onRemove: function (map) {
        L.TileLayer.Vector.prototype.onRemove.apply(this, arguments);
        this.of('tilerequest', this._onTileRequest, this);
        this.of('tileresponse', this._onTileResponse, this);
        this.off('tileload', this._onTileLoad, this);
    },

    _onTileRequest: function(evt) {
        var tile = evt.tile,
            layer = tile.layer;

        this._requestCount++;
        console.log('request-start: ' + tile.key + ' - ' + this._requestCount);
    },

    _onTileResponse: function(evt) {
        var tile = evt.tile,
            layer = tile.layer;
        
        this._requestCount--;
        console.log('request-end  : ' + tile.key + ' - ' + this._requestCount);
    },

    _onTileLoad: function(evt) {
        var tile = evt.tile,
            layer = tile.layer,
            tileSize = this.options.tileSize,
            x = tile.key.split(':')[0],
            y = tile.key.split(':')[1],
            tilePoint = new L.Point(x, y),
            nwPoint = tilePoint.multiplyBy(tileSize),
            sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
            nw = this._map.unproject(nwPoint),
            se = this._map.unproject(sePoint),
            latLngBounds = L.latLngBounds(nw, se),
            tilePos = this._getTilePos(tilePoint),
            lBounds, textEle, textNode, text;
            
        console.log('loaded       : ' + tile.key);

        lBounds = L.rectangle(latLngBounds, {
                weight: 1,
                //stroke: false,
                //dashArray: '8, 8',
                color: 'red',
                opacity: 0.5,
                fill: false,
                //fillOpacity: 0.5,
                clickable: false
        });
        layer.addLayer(lBounds);
        //lBounds._path.setAttribute('shape-rendering', 'crispEdges');
        //lBounds._path.setAttribute('stroke-linejoin', 'miter');
        //lBounds._path.setAttribute('stroke-linecap', 'square');

        textEle = lBounds._createElement('text');
        textEle.setAttribute('x', tilePos.x);
        textEle.setAttribute('y', tilePos.y);
        textEle.setAttribute('dx', '0.5em');
        textEle.setAttribute('dy', '1.5em');
        textEle.setAttribute('style', 'fill: red; font-family: "Lucida Console", Monaco, monospace;');

        text = layer._map.getZoom() + '/' + x + '/' + y + '  ' + '(' + tile.key + ')';
        textNode = document.createTextNode(text);
        textEle.appendChild(textNode);

        lBounds._container.appendChild(textEle);
    }
});