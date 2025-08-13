package advogados_popular.api_advogados_popular.controllers;

import advogados_popular.api_advogados_popular.DTOs.Chat.MensagemRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Chat.MensagemResponseDTO;
import advogados_popular.api_advogados_popular.sevices.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{chatId}/mensagens")
    public ResponseEntity<List<MensagemResponseDTO>> listar(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.listarMensagens(chatId));
    }

    @PostMapping("/{chatId}/mensagens")
    public ResponseEntity<MensagemResponseDTO> enviar(@PathVariable Long chatId,
                                                      @RequestBody MensagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.enviarMensagem(chatId, dto));
    }

    @MessageMapping("/chat/{chatId}")
    public void enviarViaWebSocket(@DestinationVariable Long chatId, MensagemRequestDTO dto) {
        chatService.enviarMensagem(chatId, dto);
    }
}

