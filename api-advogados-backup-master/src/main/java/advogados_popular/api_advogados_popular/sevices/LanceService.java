package advogados_popular.api_advogados_popular.sevices;

import advogados_popular.api_advogados_popular.DTOs.Lance.LanceRequestDTO;
import advogados_popular.api_advogados_popular.DTOs.Lance.LanceResponseDTO;
import advogados_popular.api_advogados_popular.DTOs.utils.Role;
import advogados_popular.api_advogados_popular.Entitys.*;
import advogados_popular.api_advogados_popular.Repositorys.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (account.getRole() != Role.ADVOGADO) {
            throw new RuntimeException("Apenas advogados podem enviar lances.");
        }

        Advogado advogado = advogadoRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Advogado não encontrado"));

        Causa causa = causaRepository.findById(dto.causaId())
                .orElseThrow(() -> new RuntimeException("Causa não encontrada"));

        Lance lance = new Lance();
        lance.setValor(dto.valor());
        lance.setCausa(causa);
        lance.setAdvogado(advogado);

        Chat chat = new Chat();
        chat.setLance(lance);
        chat.setPropostaAceita(false);
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

