package docrob.venusrestblog.controller;

import docrob.venusrestblog.data.Category;
import docrob.venusrestblog.data.Post;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping(value = "/api/categories", produces = "application/json")
public class CategoriesController {
    @GetMapping("")
 private Category getPostsByCategory(@RequestParam String categoryName){
        Category category = new Category(1L, categoryName, null);
        ArrayList<Post> fakePosts = new ArrayList<>();
        fakePosts.add(new Post(1L,"Bunnies", "Rock", null, null));
        fakePosts.add(new Post(2L,"Bun", "Ro", null, null));
        category.setPosts(fakePosts);

        return category;
 }

}
