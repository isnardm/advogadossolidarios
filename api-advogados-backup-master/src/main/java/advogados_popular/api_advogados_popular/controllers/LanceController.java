package advogados_popular.api_advogados_popular.controllers;

import advogados_popular.api_advogados_popular.DTOs.Lance.LanceRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Lance.LanceResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.Lance.LanceRecebidaResponseDTO;
import advogados_popular.api_advogados_popular.sevices.LanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lances")
public class LanceController {

    private final LanceService lanceService;

    public LanceController(LanceService lanceService) {
        this.lanceService = lanceService;
    }

    @PostMapping
    public ResponseEntity<LanceResponseDTO> criar(@RequestBody LanceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lanceService.criarLance(dto));
    }

    @GetMapping("/recebidas")
    public ResponseEntity<java.util.List<LanceRecebidaResponseDTO>> listarRecebidas() {
        return ResponseEntity.ok(lanceService.listarRecebidasUsuario());
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<LanceResponseDTO> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(lanceService.aprovarLance(id));
    }

    @PostMapping("/{id}/recusar")
    public ResponseEntity<LanceResponseDTO> recusar(@PathVariable Long id) {
        return ResponseEntity.ok(lanceService.recusarLance(id));
    }

    @GetMapping("/historico")
    public ResponseEntity<java.util.List<LanceRecebidaResponseDTO>> historicoAdvogado() {
        return ResponseEntity.ok(lanceService.listarDoAdvogado());
    }
}

