package com.example.CoreApp.repository;

import com.example.CoreApp.entity.UserEntity;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.FluentQuery;

import java.util.Optional;

public interface UserRepostory extends JpaRepository<UserEntity,Long> {
  Optional<UserEntity>findByEmail(String email);

  //if this is true then user already have account and if this is false then he can register

     Boolean existsByEmail(String email);


}
