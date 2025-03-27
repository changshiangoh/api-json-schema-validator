import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MyController {

    @PostMapping("/submit")
    public void submitData(@RequestBody MyRequest request) {
        // Handle the request
    }
}