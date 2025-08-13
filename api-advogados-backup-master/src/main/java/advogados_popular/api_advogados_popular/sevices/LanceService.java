package advogados_popular.api_advogados_popular.sevices;

import advogados_popular.api_advogados_popular.DTOs.Lance.LanceRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Lance.LanceResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.utils.Role;
import advogados_popular.api_advogados_popular.Entitys.*;
import advogados_popular.api_advogados_popular.Repositorys.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LanceService {

    private final LanceRepository lanceRepository;
    private final CausaRepository causaRepository;
    private final AdvogadoRepository advogadoRepository;
    private final AccountRepository accountRepository;

    public LanceService(LanceRepository lanceRepository,
                        CausaRepository causaRepository,
                        AdvogadoRepository advogadoRepository,
                        AccountRepository accountRepository) {
        this.lanceRepository = lanceRepository;
        this.causaRepository = causaRepository;
        this.advogadoRepository = advogadoRepository;
        this.accountRepository = accountRepository;
    }

    public LanceResponseDTO criarLance(LanceRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas advogados podem enviar lances.");
        }

        Advogado advogado = advogadoRepository.findByAccountEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Advogado não encontrado"));

        Causa causa = causaRepository.findById(dto.causaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Causa não encontrada"));

        Lance lance = new Lance();
        lance.setValor(dto.valor());
        lance.setCausa(causa);
        lance.setAdvogado(advogado);

        Chat chat = new Chat();
        chat.setLance(lance);
        chat.setPropostaAceita(false);
        if (dto.comentario() != null && !dto.comentario().isBlank()) {
            Mensagem mensagem = new Mensagem();
            mensagem.setChat(chat);
            mensagem.setConteudo(dto.comentario());
            mensagem.setEnviadaEm(LocalDateTime.now());
            mensagem.setRemetente("ADVOGADO");
            chat.setMensagens(List.of(mensagem));
        }
        lance.setChat(chat);

        Lance salvo = lanceRepository.save(lance);

        return new LanceResponseDTO(
                salvo.getId(),
                salvo.getValor(),
                salvo.getCausa().getId(),
                salvo.getAdvogado().getId(),
                salvo.getChat().getId()
        );
    }
}

