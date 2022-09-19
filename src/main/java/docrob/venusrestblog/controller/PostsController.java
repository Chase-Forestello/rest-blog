package docrob.venusrestblog.controller;

import docrob.venusrestblog.data.Category;
import docrob.venusrestblog.data.Post;

import docrob.venusrestblog.data.User;
import docrob.venusrestblog.repository.CategoriesRepository;
import docrob.venusrestblog.repository.UsersRepository;
import docrob.venusrestblog.services.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import docrob.venusrestblog.repository.PostsRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping(value = "/api/posts", produces = "application/json")
public class PostsController {
    private final PostsRepository postRepository;
    private final UsersRepository userRepository;
    private final CategoriesRepository categoryRepository;

    private final EmailService emailService;


    @GetMapping("")
//    @RequestMapping(value = "/", method = RequestMethod.GET)
    public List<Post> fetchPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Post> fetchPostById(@PathVariable long id) {
        return postRepository.findById(id);
    }

    @PostMapping("")
    public void createPost(@RequestBody Post newPost) {
//        System.out.println(newPost);
        // assign  nextId to the new post
        // make a fake author for the post
        User author = userRepository.findById(1L).get();
        newPost.setAuthor(author);
//        newPost.setCategories(new ArrayList<>());

        // use first 2 categories for the post by default
//        Category cat1 = categoryRepository.findById(2L).get();
//        Category cat2 = categoryRepository.findById(1L).get();

//        newPost.getCategories().add(cat1);
//        newPost.getCategories().add(cat2);
        postRepository.save(newPost);
        emailService.prepareAndSend(newPost, "New post created by: " + newPost.getAuthor().getUserName(), "Title: " + newPost.getTitle() + "\nContent: " + newPost.getContent());
    }

    @DeleteMapping("/{id}")
    public void deletePostById(@PathVariable long id) {
        postRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void updatePost(@RequestBody Post updatedPost, @PathVariable long id) {
        // find the post to update in the posts list
        updatedPost.setId(id);
        postRepository.save(updatedPost);
//        Post post = findPostById(id);
//        if(post == null) {
//            System.out.println("Post not found");
//        } else {
//            if(updatedPost.getTitle() != null) {
//                post.setTitle(updatedPost.getTitle());
//            }
//            if(updatedPost.getContent() != null) {
//                post.setContent(updatedPost.getContent());
//            }
//            return;
//        }
//        throw new RuntimeException("Post not found");
    }
}
