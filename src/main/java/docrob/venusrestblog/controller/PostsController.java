package docrob.venusrestblog.controller;

import docrob.venusrestblog.data.Post;

import org.springframework.web.bind.annotation.*;
import docrob.venusrestblog.repository.PostsRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/posts", produces = "application/json")
public class PostsController {
    private final PostsRepository postRepository;

    public PostsController(PostsRepository postRepository) {
        this.postRepository = postRepository;
    }


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
//        User fakeAuthor = new User();
//        fakeAuthor.setId(99L);
//        fakeAuthor.setUserName("Fake Author");
//        fakeAuthor.setEmail("Fake@gmail.com");
//        newPost.setAuthor(fakeAuthor);
//        Category cat1 = new Category(1L, "bunnies", null);
//        Category cat2 = new Category(2L, "margs", null);
//        newPost.setCategories(new ArrayList<>());
//        newPost.getCategories().add(cat1);
//        newPost.getCategories().add(cat2);
        postRepository.save(newPost);
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
