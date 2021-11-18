import { useCallback } from "react"

const useGeojson = () => {
    const wgs84 = {
        RADIUS: 6378137,
        FLATTENING_DENOM: 298.257223563,
        FLATTENING: (1 / 298.257223563),
        POLAR_RADIUS: (6378137 * (1 - (1 / 298.257223563)))
    }
    const getCoordinatesDump = (geojson) => {
        var coords;
        if (geojson.type == 'Point') {
            coords = [geojson.coordinates];
        } else if (geojson.type == 'LineString' || geojson.type == 'MultiPoint') {
            coords = geojson.coordinates;
        } else if (geojson.type == 'Polygon' || geojson.type == 'MultiLineString') {
            coords = geojson.coordinates.reduce(function (dump, part) {
                return dump.concat(part);
            }, []);
        } else if (geojson.type == 'MultiPolygon') {
            coords = geojson.coordinates.reduce(function (dump, poly) {
                return dump.concat(poly.reduce(function (points, part) {
                    return points.concat(part);
                }, []));
            }, []);
        } else if (geojson.type == 'Feature') {
            coords = getCoordinatesDump(geojson.geometry);
        } else if (geojson.type == 'GeometryCollection') {
            coords = geojson.geometries.reduce(function (dump, geometryEntry) {
                return dump.concat(getCoordinatesDump(geometryEntry));
            }, []);
        } else if (geojson.type == 'FeatureCollection') {
            coords = geojson.features.reduce(function (dump, featureEntry) {
                return dump.concat(getCoordinatesDump(featureEntry));
            }, []);
        }
        return coords;
    }


    //bbox is an array [left, bottom, right, top]
    const getBoundingBox = (geojson) => {
        var coords, bbox;
        if (!geojson.hasOwnProperty('type')) return;
        coords = getCoordinatesDump(geojson);
        bbox = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY,];
        return coords.reduce(function (prev, coord) {
            return [
                Math.min(coord[0], prev[0]),
                Math.min(coord[1], prev[1]),
                Math.max(coord[0], prev[2]),
                Math.max(coord[1], prev[3])
            ];
        }, bbox);
    }
    const boundingBoxContainsCoordinates = (geojson, coordinates) => {
        if (!geojson.hasOwnProperty('type')) return;
        const [left, bottom, right, top] = getBoundingBox(geojson);
        return coordinates.lng >= left && coordinates.lng <= right && coordinates.lat >= bottom && coordinates.lat <= top;
    }

    /**
     * Calculate the approximate area of the polygon were it projected onto
     *     the earth.  Note that this area will be positive if ring is oriented
     *     clockwise, otherwise it will be negative.
     *
     * Reference:
     * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
     *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
     *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
     *
     * Returns:
     * {float} The approximate signed geodesic area of the polygon in square
     *     meters.
     */

    const ringArea = (coords) => {
        var p1, p2, p3, lowerIndex, middleIndex, upperIndex, i,
            area = 0,
            coordsLength = coords.length;

        if (coordsLength > 2) {
            for (i = 0; i < coordsLength; i++) {
                if (i === coordsLength - 2) {// i = N-2
                    lowerIndex = coordsLength - 2;
                    middleIndex = coordsLength - 1;
                    upperIndex = 0;
                } else if (i === coordsLength - 1) {// i = N-1
                    lowerIndex = coordsLength - 1;
                    middleIndex = 0;
                    upperIndex = 1;
                } else { // i = 0 to N-3
                    lowerIndex = i;
                    middleIndex = i + 1;
                    upperIndex = i + 2;
                }
                p1 = coords[lowerIndex];
                p2 = coords[middleIndex];
                p3 = coords[upperIndex];
                area += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
            }

            area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
        }

        return area;
    }

    const rad = (_) => {
        return _ * Math.PI / 180;
    }

    const geometryArea = (geojson) => {
        let area = 0;
        switch (geojson.type) {
            case 'Polygon':
                return polygonArea(geojson.coordinates);
            case 'MultiPolygon':
                for (let i = 0; i < geojson.coordinates.length; i++) {
                    area += polygonArea(geojson.coordinates[i]);
                }
                return area;
            case 'Point':
            case 'MultiPoint':
            case 'LineString':
            case 'MultiLineString':
                return 0;
            case 'GeometryCollection':
                for (let i = 0; i < geojson.geometries.length; i++) {
                    area += geometryArea(geojson.geometries[i]);
                }
                return area;
            case 'FeatureCollection':
                for (let i = 0; i < geojson.features.length; i++) {
                    area += geometryArea(geojson.features[i]);
                }
                return area;
            case 'Feature':
                area += geometryArea(geojson.geometry);
                return area;
        }
    }

    function polygonArea(coords) {
        var area = 0;
        if (coords && coords.length > 0) {
            area += Math.abs(ringArea(coords[0]));
            for (var i = 1; i < coords.length; i++) {
                area -= Math.abs(ringArea(coords[i]));
            }
        }
        return area;
    }



    const getCenterCoordinates = (geojson) => {
        if (!geojson.hasOwnProperty('type')) return;
        const [left, bottom, right, top] = getBoundingBox(geojson);

        return { lat: ((top + bottom) / 2), lng: ((left + right) / 2) };
    }

    const getAdminLevelName = (geojson) => {
        let featureLevel = geojson.properties.admin_level
        // let featureType = geojson.properties.admin_level_type
        let featureName = geojson.properties.name || geojson.properties[("admin_level_" + featureLevel)];
        return featureName;
    }

    return { getBoundingBox, getCoordinatesDump, getAdminLevelName, getCenterCoordinates, geometryArea };
}

export default useGeojson;