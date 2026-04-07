package com.pomobee.backend.dto;

public class StatsResponse {
    private final int totalMinutes ;
    private final int sessions ;

    public StatsResponse(int totalMinutes , int sessions){
        this.sessions = sessions ;
        this.totalMinutes = totalMinutes;
    }

    public int getTotalMinutes(){return totalMinutes; }
    public int getSessions(){return sessions; }
}
