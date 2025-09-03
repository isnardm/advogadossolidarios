package advogados_popular.api_advogados_popular.sevices;

import advogados_popular.api_advogados_popular.DTOs.Chat.MensagemRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Chat.MensagemResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.utils.Role;
import advogados_popular.api_advogados_popular.Entitys.Account;
import advogados_popular.api_advogados_popular.Entitys.Chat;
import advogados_popular.api_advogados_popular.Entitys.Mensagem;
import advogados_popular.api_advogados_popular.DTOs.statusProposta;
import advogados_popular.api_advogados_popular.Repositorys.AccountRepository;
import advogados_popular.api_advogados_popular.Repositorys.ChatRepository;
import advogados_popular.api_advogados_popular.Repositorys.MensagemRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final MensagemRepository mensagemRepository;
    private final AccountRepository accountRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(ChatRepository chatRepository,
                       MensagemRepository mensagemRepository,
                       AccountRepository accountRepository,
                       SimpMessagingTemplate messagingTemplate) {
        this.chatRepository = chatRepository;
        this.mensagemRepository = mensagemRepository;
        this.accountRepository = accountRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public MensagemResponseDTO enviarMensagem(Long chatId, MensagemRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));

        if (chat.getStatus() != statusProposta.APROVADA) {
            throw new RuntimeException("Chat não disponível");
        }

        Mensagem mensagem = new Mensagem();
        mensagem.setChat(chat);
        mensagem.setConteudo(dto.conteudo());
        mensagem.setEnviadaEm(LocalDateTime.now());
        mensagem.setRemetente(account.getRole() == Role.ADVOGADO ? "ADVOGADO" : "USUARIO");

        Mensagem salvo = mensagemRepository.save(mensagem);

        MensagemResponseDTO response = new MensagemResponseDTO(
                salvo.getId(),
                salvo.getConteudo(),
                salvo.getEnviadaEm(),
                salvo.getRemetente()
        );

        messagingTemplate.convertAndSend("/topic/chat/" + chatId, response);

        return response;
    }

    public List<MensagemResponseDTO> listarMensagens(Long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));

        if (chat.getStatus() != statusProposta.APROVADA) {
            throw new RuntimeException("Chat não disponível");
        }

        return mensagemRepository.findByChatId(chatId).stream()
                .map(m -> new MensagemResponseDTO(
                        m.getId(),
                        m.getConteudo(),
                        m.getEnviadaEm(),
                        m.getRemetente()
                ))
                .toList();
    }
}

