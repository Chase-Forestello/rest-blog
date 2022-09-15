package docrob.venusrestblog.controller;

import docrob.venusrestblog.data.User;
import docrob.venusrestblog.repository.UsersRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/users", produces = "application/json")
public class UsersController {
    private final UsersRepository userRepository;

    public UsersController(UsersRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    private Optional<User> findMe() {
        return userRepository.findById(1L);
    }

    @GetMapping("")
    public List<User> fetchUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<User> fetchUserById(@PathVariable long id) {
        return userRepository.findById(id);
    }


//    @GetMapping("/username/{userName}")
//    private User fetchByUserName(@PathVariable String userName) {
//        User user = findUserByUserName(userName);
//        if (user == null) {
//            // what to do if we don't find it
//            throw new RuntimeException("I don't know what I am doing");
//        }
//        return user;
//    }
//
//    @GetMapping("/email/{email}")
//    private User fetchByEmail(@PathVariable String email) {
//        User user = findUserByEmail(email);
//        if (user == null) {
//            // what to do if we don't find it
//            throw new RuntimeException("I don't know what I am doing");
//        }
//        return user;
//    }

//    private User findUserByUserName(String userName) {
//        for (User user : users) {
//            if (user.getUserName().equals(userName)) {
//                return user;
//            }
//        }
//        // didn't find it so do something
//        return null;
//    }
//
//    private User findUserByEmail(String email) {
//        for (User user : users) {
//            if (user.getEmail().equals(email)) {
//                return user;
//            }
//        }
//        // didn't find it so do something
//        return null;
//    }
//
//    private User findUserById(long id) {
//        for (User user : users) {
//            if (user.getId() == id) {
//                return user;
//            }
//        }
//        // didn't find it so do something
//        return null;
//    }

    @PostMapping("/create")
    public void createUser(@RequestBody User newUser) {
        // assign  nextId to the new post
        userRepository.save(newUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUserById(@PathVariable long id) {
        userRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void updateUser(@RequestBody User updatedUser, @PathVariable long id) {
        // find the post to update in the posts list
        updatedUser.setId(id);
        userRepository.save(updatedUser);
    }

    @PutMapping("/{id}/updatePassword")
    private void updatePassword(@PathVariable Long id, @RequestParam(required = false) String oldPassword, @Valid @Size(min = 3) @RequestParam String newPassword) {
        User user = userRepository.findById(id).get();
//        if(user == null) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User id " + id + " not found");
//        }
        // compare old password with saved pw
        if (!user.getPassword().equals(oldPassword)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "amscray");
        }
        // validate new password
        if (newPassword.length() < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "new pw length must be at least 3 characters");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
    }
}