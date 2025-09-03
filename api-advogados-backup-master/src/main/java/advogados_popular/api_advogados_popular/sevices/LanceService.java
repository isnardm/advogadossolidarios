package advogados_popular.api_advogados_popular.sevices;

import advogados_popular.api_advogados_popular.DTOs.Lance.LanceRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Lance.LanceResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.Lance.LanceRecebidaResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.utils.Role;
import advogados_popular.api_advogados_popular.DTOs.statusCausa;
import advogados_popular.api_advogados_popular.DTOs.statusProposta;
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
    private final UserRepository userRepository;

    public LanceService(LanceRepository lanceRepository,
                        CausaRepository causaRepository,
                        AdvogadoRepository advogadoRepository,
                        AccountRepository accountRepository,
                        UserRepository userRepository) {
        this.lanceRepository = lanceRepository;
        this.causaRepository = causaRepository;
        this.advogadoRepository = advogadoRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public LanceResponseDTO criarLance(LanceRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas advogados podem enviar lances.");
        }

        Advogado advogado = advogadoRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Advogado não encontrado"));

        Causa causa = causaRepository.findById(dto.causaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Causa não encontrada"));

        Lance lance = new Lance();
        lance.setValor(dto.valor());
        lance.setCausa(causa);
        lance.setAdvogado(advogado);

        Chat chat = new Chat();
        chat.setLance(lance);
        chat.setStatus(statusProposta.PENDENTE);
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
                salvo.getChat().getId(),
                salvo.getChat().getStatus()
        );
    }

    public List<LanceRecebidaResponseDTO> listarRecebidasUsuario() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));

        if (account.getRole() != Role.USUARIO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas usuários podem visualizar lances pendentes.");
        }

        User usuario = userRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        return lanceRepository.findByCausa_Usuario_Id(usuario.getId()).stream()
                .map(l -> new LanceRecebidaResponseDTO(
                        l.getId(),
                        l.getValor(),
                        l.getCausa().getId(),
                        l.getCausa().getTitulo(),
                        l.getAdvogado().getId(),
                        l.getAdvogado().getNome(),
                        l.getChat().getStatus(),
                        l.getChat().getId()))
                .toList();
    }

    public LanceResponseDTO aprovarLance(Long lanceId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));

        if (account.getRole() != Role.USUARIO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas usuários podem aprovar lances.");
        }

        User usuario = userRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Lance lance = lanceRepository.findById(lanceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lance não encontrado"));

        if (!lance.getCausa().getUsuario().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Lance não pertence a um caso do usuário.");
        }

        Chat chat = lance.getChat();
        chat.setStatus(statusProposta.APROVADA);

        Causa causa = lance.getCausa();
        causa.setStatus(statusCausa.NEGOCIANDO);
        causaRepository.save(causa);

        Lance salvo = lanceRepository.save(lance);

        return new LanceResponseDTO(
                salvo.getId(),
                salvo.getValor(),
                salvo.getCausa().getId(),
                salvo.getAdvogado().getId(),
                salvo.getChat().getId(),
                salvo.getChat().getStatus()
        );
    }

    public LanceResponseDTO recusarLance(Long lanceId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));

        if (account.getRole() != Role.USUARIO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas usuários podem recusar lances.");
        }

        User usuario = userRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Lance lance = lanceRepository.findById(lanceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lance não encontrado"));

        if (!lance.getCausa().getUsuario().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Lance não pertence a um caso do usuário.");
        }

        Chat chat = lance.getChat();
        chat.setStatus(statusProposta.RECUSADA);

        Lance salvo = lanceRepository.save(lance);

        return new LanceResponseDTO(
                salvo.getId(),
                salvo.getValor(),
                salvo.getCausa().getId(),
                salvo.getAdvogado().getId(),
                salvo.getChat().getId(),
                salvo.getChat().getStatus()
        );
    }

    public List<LanceRecebidaResponseDTO> listarDoAdvogado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas advogados podem visualizar histórico de lances.");
        }

        Advogado advogado = advogadoRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Advogado não encontrado"));

        return lanceRepository.findByAdvogado_Id(advogado.getId()).stream()
                .map(l -> new LanceRecebidaResponseDTO(
                        l.getId(),
                        l.getValor(),
                        l.getCausa().getId(),
                        l.getCausa().getTitulo(),
                        l.getAdvogado().getId(),
                        l.getAdvogado().getNome(),
                        l.getChat().getStatus(),
                        l.getChat().getId()))
                .toList();
    }
}

