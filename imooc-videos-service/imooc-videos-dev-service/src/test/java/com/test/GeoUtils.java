package com.test;

public class GeoUtils {
    private static final double EARTH_RADIUS_M = 6371000.0; // 地球平均半径，米

    /**
     * 计算两个经纬度之间的距离（米）
     * @param lat1 纬度1
     * @param lon1 经度1
     * @param lat2 纬度2
     * @param lon2 经度2
     * @return 距离，单位米
     */
    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double dPhi = Math.toRadians(lat2 - lat1);
        double dLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2)
                + Math.cos(phi1) * Math.cos(phi2)
                * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_M * c;
    }

    /**
     * 判断目标点是否在以某点为圆心、指定半径的范围内
     */
    public static boolean isWithinRadius(double centerLat, double centerLon,
                                         double targetLat, double targetLon,
                                         double radiusMeters) {
        return haversine(centerLat, centerLon, targetLat, targetLon) <= radiusMeters;
    }

    public static void main(String[] args) {
        // 北京天安门 → 故宫
//        double d = haversine(39.9087, 116.3975, 39.9163, 116.3972);
//        System.out.printf("距离: %.1f 米%n", d); // 约 845 米
//
//        // 车位场景：车辆是否在车位 30 米范围内
//        boolean inRange = isWithinRadius(39.9087, 116.3975, 39.9089, 116.3978, 30);
//        System.out.println("在车位范围内: " + inRange);


        double d = haversine(116.91, 39.58, 116.91, 39.58);
        System.out.printf("距离: %.1f 米%n", d); // 约 845 米

        // 车位场景：车辆是否在车位 30 米范围内
        boolean inRange = isWithinRadius(116.91, 39.58, 116.91, 39.58, 30);
        System.out.println("在车位范围内: " + inRange);
    }
}