import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MyController {

    @PostMapping("/submit")
    public void submitData(@RequestBody MyRequest request) {
        // Handle the request
    }

    @PutMapping("/commit")
    public void commitData(@RequestBody String request) {
        // Handle the request
    }

    @PostMapping("/add")
    public void commitData(@RequestBody MyRequest request) {
        // Handle the request
    }
}