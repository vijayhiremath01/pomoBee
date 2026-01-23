package com.pomodoro.pomodoro.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionType ;

    private int duration ; 

    private boolean completed ; 

    private LocalDateTime startTime ; 
    private LocalDateTime endTime ; 
   

    // Getters 
    public Long getId(){
        return id ; 
    }

    public String getSessionType(){
        return sessionType ; 
    }

    public int getDuration(){
        return duration ; 
    }

    public boolean isCompleted(){
        return completed ; 
    }

    public LocalDateTime getStartTime(){
        return startTime ; 
    }

    public LocalDateTime getEndTime(){
        return endTime ; 
    }

   // Setters 
   public void setId(Long id){
    this.id = id ;
   }
   
   public void setSessionType(String sessionType){
    this.sessionType = sessionType ;
   }

   public void setDuration(int duration){
    this.duration = duration ;
   }
   
   public void setCompleted(boolean completed){
    this.completed = completed ;
   }
   
   public void setStartTime(LocalDateTime startTime){
    this.startTime = startTime ;
   }
   
   public void setEndTime(LocalDateTime endTime){
    this.endTime = endTime ;
   }


}
