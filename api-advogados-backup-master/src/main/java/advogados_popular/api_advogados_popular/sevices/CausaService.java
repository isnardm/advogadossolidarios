package advogados_popular.api_advogados_popular.sevices;

import advogados_popular.api_advogados_popular.DTOs.Causa.CausaRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Causa.CausaResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.statusCausa;
import advogados_popular.api_advogados_popular.DTOs.utils.Role;
import advogados_popular.api_advogados_popular.Entitys.Account;
import advogados_popular.api_advogados_popular.Entitys.Advogado;
import advogados_popular.api_advogados_popular.Entitys.Causa;
import advogados_popular.api_advogados_popular.Entitys.User;
import advogados_popular.api_advogados_popular.Repositorys.AccountRepository;
import advogados_popular.api_advogados_popular.Repositorys.AdvogadoRepository;
import advogados_popular.api_advogados_popular.Repositorys.CausaRepository;
import advogados_popular.api_advogados_popular.Repositorys.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CausaService {

    private final CausaRepository causaRepository;
    private final UserRepository usuarioRepository;
    private final AccountRepository accountRepository;
    private final AdvogadoRepository advogadoRepository;

    public CausaService(CausaRepository causaRepository,
                        UserRepository usuarioRepository,
                        AccountRepository accountRepository,
                        AdvogadoRepository advogadoRepository) {
        this.causaRepository = causaRepository;
        this.usuarioRepository = usuarioRepository;
        this.accountRepository = accountRepository;
        this.advogadoRepository = advogadoRepository;
    }

    public List<CausaResponseDTO> listarCausas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new RuntimeException("Apenas advogados podem visualizar as causas.");
        }

        return causaRepository.findAll().stream()
                .map(causa -> new CausaResponseDTO(
                        causa.getId(),
                        causa.getTitulo(),
                        causa.getDescricao(),
                        causa.getUsuario().getNome(),
                        causa.getStatus()
                ))
                .toList();
    }

    public List<CausaResponseDTO> listarHistorico() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new RuntimeException("Apenas advogados podem visualizar as causas.");
        }

        Advogado advogado = advogadoRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Advogado não encontrado"));

        return causaRepository.findByLances_Advogado_IdAndLances_Chat_PropostaAceitaTrue(advogado.getId()).stream()
                .map(causa -> new CausaResponseDTO(
                        causa.getId(),
                        causa.getTitulo(),
                        causa.getDescricao(),
                        causa.getUsuario().getNome(),
                        causa.getStatus()
                ))
                .toList();
    }

    public CausaResponseDTO buscarPorId(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new RuntimeException("Apenas advogados podem visualizar as causas.");
        }

        Causa causa = causaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Causa não encontrada."));

        return new CausaResponseDTO(
                causa.getId(),
                causa.getTitulo(),
                causa.getDescricao(),
                causa.getUsuario().getNome(),
                causa.getStatus()
        );
    }

    public CausaResponseDTO cadastrar(CausaRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (account.getRole() != Role.USUARIO) {
            throw new RuntimeException("Apenas usuários podem cadastrar causas.");
        }

        User usuario = usuarioRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Causa causa = new Causa();
        causa.setTitulo(dto.titulo());
        causa.setDescricao(dto.descricao());
        causa.setUsuario(usuario);
        causa.setStatus(statusCausa.ABERTA);

        Causa salvo = causaRepository.save(causa);

        return new CausaResponseDTO(
                salvo.getId(),
                salvo.getTitulo(),
                salvo.getDescricao(),
                usuario.getNome(),
                salvo.getStatus()
        );
    }
}


